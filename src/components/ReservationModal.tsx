
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CarType } from "./CarCard";

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  car: CarType;
}

const ReservationModal = ({ isOpen, onClose, car }: ReservationModalProps) => {
  const { t, language } = useLanguage();
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
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Here you would typically send the reservation data to your backend
    // For now, let's simulate an API call with a timeout
    setTimeout(() => {
      console.log("Reservation submitted:", { car, ...formData });
      
      toast({
        title: "Reservation Submitted",
        description: "We'll contact you shortly to confirm your reservation.",
        duration: 5000,
      });
      
      setIsSubmitting(false);
      onClose();
      setFormData({
        firstName: "",
        lastName: "",
        phone: "",
        city: "",
        pickupDate: "",
        returnDate: ""
      });
    }, 1500);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div 
        className={`bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto ${
          language === 'ar' ? 'text-right' : 'text-left'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-xl font-bold text-morocco-secondary">
            {t("cars.reserve")} - {car.name}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("form.name")}
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-morocco-primary"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("form.lastname")}
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-morocco-primary"
                required
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("form.phone")}
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-morocco-primary"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("form.city")}
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-morocco-primary"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("form.pickup")}
              </label>
              <input
                type="date"
                name="pickupDate"
                value={formData.pickupDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-morocco-primary"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("form.return")}
              </label>
              <input
                type="date"
                name="returnDate"
                value={formData.returnDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-morocco-primary"
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 mr-2"
            >
              {t("form.cancel")}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 bg-morocco-primary text-white rounded-md hover:bg-opacity-90 transition-colors ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? t("form.submitting") : t("form.submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationModal;
