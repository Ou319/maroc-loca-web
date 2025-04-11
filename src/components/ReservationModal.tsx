
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CarType } from "./CarCard";
import { Calendar, Car, CreditCard, Phone, User, CheckCircle } from "lucide-react";

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  car: CarType;
}

const ReservationModal = ({ isOpen, onClose, car }: ReservationModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    city: "",
    pickupDate: "",
    returnDate: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.phone || 
        !formData.city || !formData.pickupDate || !formData.returnDate) {
      toast({
        title: "Missing information",
        description: "Please fill in all the required fields.",
        variant: "destructive",
      });
      return false;
    }
    
    const pickup = new Date(formData.pickupDate);
    const returnDate = new Date(formData.returnDate);
    
    if (pickup < new Date()) {
      toast({
        title: "Invalid date",
        description: "Pickup date cannot be in the past.",
        variant: "destructive",
      });
      return false;
    }
    
    if (returnDate <= pickup) {
      toast({
        title: "Invalid date range",
        description: "Return date must be after pickup date.",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Submit to Supabase
      const { error } = await supabase
        .from('reservations')
        .insert({
          car_id: car.id,
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          city: formData.city,
          pickup_date: new Date(formData.pickupDate).toISOString(),
          return_date: new Date(formData.returnDate).toISOString(),
          status: 'pending'
        });
        
      if (error) throw error;
      
      toast({
        title: "Reservation submitted!",
        description: "We will contact you shortly to confirm your reservation.",
      });
      
      // Show confirmation screen instead of closing
      setIsSubmitted(true);
      
    } catch (error) {
      console.error("Error submitting reservation:", error);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your reservation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetAndClose = () => {
    // Reset form and close modal
    setFormData({
      firstName: "",
      lastName: "",
      phone: "",
      city: "",
      pickupDate: "",
      returnDate: ""
    });
    setIsSubmitted(false);
    onClose();
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  const calculateTotal = () => {
    if (!formData.pickupDate || !formData.returnDate) return 0;
    
    const pickup = new Date(formData.pickupDate);
    const returnDate = new Date(formData.returnDate);
    const days = Math.ceil((returnDate.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24));
    
    return days * car.price;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && resetAndClose()}>
      <DialogContent className="max-w-md md:max-w-2xl">
        {isSubmitted ? (
          // Confirmation Screen
          <div className="text-center py-8">
            <div className="flex justify-center mb-6">
              <CheckCircle className="text-green-500 h-16 w-16" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Reservation Submitted!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for your reservation request for the {car.name}. Our team will contact you 
              shortly at {formData.phone} to confirm your booking details.
            </p>
            <div className="bg-gray-50 p-6 rounded-lg mb-6 text-left">
              <h3 className="font-semibold mb-4">Reservation Summary:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p><span className="font-medium">Name:</span> {formData.firstName} {formData.lastName}</p>
                  <p><span className="font-medium">Phone:</span> {formData.phone}</p>
                  <p><span className="font-medium">City:</span> {formData.city}</p>
                </div>
                <div>
                  <p><span className="font-medium">Vehicle:</span> {car.name}</p>
                  <p><span className="font-medium">Pickup:</span> {formatDate(formData.pickupDate)}</p>
                  <p><span className="font-medium">Return:</span> {formatDate(formData.returnDate)}</p>
                  <p className="font-medium mt-2">Total: {calculateTotal()} MAD</p>
                </div>
              </div>
            </div>
            <button
              onClick={resetAndClose}
              className="px-6 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
        <>
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl">
              Reserve Your {car.name}
            </DialogTitle>
          </DialogHeader>
          
          {/* Car Details */}
          <div className="flex flex-col md:flex-row items-start md:items-center mb-6 pb-6 border-b">
            <div className="w-full md:w-auto md:mr-6 mb-4 md:mb-0">
              <img 
                src={car.image}
                alt={car.name}
                className="w-full md:w-32 h-auto md:h-24 rounded-md object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg">{car.name}</h3>
              <div className="flex flex-wrap gap-2 mt-2 text-sm">
                <span className="bg-gray-100 px-2 py-1 rounded">{car.category}</span>
                <span className="bg-gray-100 px-2 py-1 rounded">{car.seats} seats</span>
                <span className="bg-gray-100 px-2 py-1 rounded">{car.transmission}</span>
                <span className="bg-gray-100 px-2 py-1 rounded">{car.fuel}</span>
              </div>
              <p className="mt-2 text-teal-600 font-semibold">{car.price} MAD / day</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Personal Info */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center">
                  <User className="mr-2 h-4 w-4" /> Personal Information
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Phone className="inline mr-1 h-4 w-4" /> Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="+212 6XX XXXXXX"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                </div>
              </div>
              
              {/* Rental Details */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center">
                  <Car className="mr-2 h-4 w-4" /> Rental Details
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Calendar className="inline mr-1 h-4 w-4" /> Pickup Date
                    </label>
                    <input
                      type="date"
                      name="pickupDate"
                      value={formData.pickupDate}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Calendar className="inline mr-1 h-4 w-4" /> Return Date
                    </label>
                    <input
                      type="date"
                      name="returnDate"
                      value={formData.returnDate}
                      onChange={handleChange}
                      min={formData.pickupDate || new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                  
                  {/* Pricing Summary */}
                  {formData.pickupDate && formData.returnDate && (
                    <div className="bg-gray-50 p-3 rounded-md mt-4">
                      <h5 className="font-medium mb-2 flex items-center">
                        <CreditCard className="mr-2 h-4 w-4" /> Pricing Summary
                      </h5>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span>Dates:</span>
                          <span>{formatDate(formData.pickupDate)} to {formatDate(formData.returnDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Daily Rate:</span>
                          <span>{car.price} MAD</span>
                        </div>
                        <div className="flex justify-between font-bold pt-1 border-t mt-1">
                          <span>Total:</span>
                          <span>{calculateTotal()} MAD</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors flex items-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Complete Reservation'
                )}
              </button>
            </div>
          </form>
        </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReservationModal;
