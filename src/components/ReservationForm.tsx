
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { CarType } from "./CarCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface ReservationFormProps {
  car: CarType;
  onClose: () => void;
}

const ReservationForm = ({ car, onClose }: ReservationFormProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    city: "",
    pickupDate: "",
    returnDate: ""
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.city || !formData.pickupDate || !formData.returnDate) {
      toast({
        title: "Form incomplete",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Convert dates to ISO format
      const pickupDate = new Date(formData.pickupDate).toISOString();
      const returnDate = new Date(formData.returnDate).toISOString();
      
      const { error } = await supabase
        .from('reservations')
        .insert({
          car_id: car.id,
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          city: formData.city,
          pickup_date: pickupDate,
          return_date: returnDate,
          status: 'pending'
        });
        
      if (error) throw error;
      
      toast({
        title: "Reservation submitted!",
        description: "We'll contact you shortly to confirm your booking.",
      });
      
      onClose();
    } catch (error) {
      console.error("Error submitting reservation:", error);
      
      toast({
        title: "Reservation failed",
        description: "There was an error submitting your reservation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Calculate min dates for pickup and return
  const today = new Date().toISOString().split('T')[0];
  const minReturnDate = formData.pickupDate || today;
  
  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          required
        />
      </div>
      
      <div>
        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          required
        />
      </div>
      
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          required
        />
      </div>
      
      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
        <input
          type="text"
          id="city"
          name="city"
          value={formData.city}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          required
        />
      </div>
      
      <div>
        <label htmlFor="pickupDate" className="block text-sm font-medium text-gray-700 mb-1">Pickup Date</label>
        <input
          type="date"
          id="pickupDate"
          name="pickupDate"
          value={formData.pickupDate}
          onChange={handleChange}
          min={today}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          required
        />
      </div>
      
      <div>
        <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700 mb-1">Return Date</label>
        <input
          type="date"
          id="returnDate"
          name="returnDate"
          value={formData.returnDate}
          onChange={handleChange}
          min={minReturnDate}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          required
        />
      </div>
      
      <div className="md:col-span-2 flex justify-end space-x-4">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors disabled:opacity-70"
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <Loader2 className="animate-spin mr-2" size={18} />
              Submitting...
            </span>
          ) : (
            "Confirm Reservation"
          )}
        </button>
      </div>
    </form>
  );
};

export default ReservationForm;
