
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Car, Info, AlertTriangle } from "lucide-react";
import ReservationModal from "./ReservationModal";

export interface CarType {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  seats: number;
  transmission: "manual" | "automatic";
  fuel: string;
  year: number;
  description: string;
  status?: string;
}

interface CarCardProps {
  car: CarType;
}

const CarCard = ({ car }: CarCardProps) => {
  const { t, language } = useLanguage();
  const [showModal, setShowModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  const isReserved = car.status === 'reserved';
  
  const openReservationModal = () => {
    if (!isReserved) {
      setShowModal(true);
    }
  };
  
  const closeReservationModal = () => {
    setShowModal(false);
  };
  
  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <>
      <div className="car-card group">
        {/* Car Image */}
        <div className="relative h-48 overflow-hidden">
          <img 
            src={car.image} 
            alt={car.name} 
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${isReserved ? 'opacity-70' : ''}`}
          />
          <div className="absolute top-0 right-0 bg-morocco-primary text-white px-3 py-1 text-sm font-bold">
            {car.price} MAD/day
          </div>
          
          {isReserved && (
            <div className="absolute top-0 left-0 bg-red-500 text-white px-3 py-1 text-sm font-bold">
              Reserved
            </div>
          )}
        </div>
        
        {/* Car Info */}
        <div className="p-4">
          <h3 className="text-xl font-bold mb-2">{car.name}</h3>
          
          <div className="flex flex-wrap gap-3 mb-4">
            <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 rounded flex items-center">
              <Car size={14} className="mr-1" />
              {car.category}
            </span>
            <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 rounded">
              {car.seats} seats
            </span>
            <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 rounded">
              {car.transmission}
            </span>
            <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 rounded">
              {car.fuel}
            </span>
          </div>
          
          {/* Expanded details */}
          {showDetails && (
            <div className="mb-4 text-sm text-gray-600 animate-fade-in">
              <p>{car.description}</p>
              <div className="mt-2">
                <p><strong>Year:</strong> {car.year}</p>
                <p><strong>Category:</strong> {car.category}</p>
                <p><strong>Fuel:</strong> {car.fuel}</p>
              </div>
            </div>
          )}
          
          {/* Action buttons */}
          <div className="flex gap-2 mt-3">
            <button 
              onClick={openReservationModal}
              className={`flex-1 ${
                isReserved 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-morocco-primary hover:bg-opacity-90'
              } text-white py-2 rounded transition-colors flex items-center justify-center`}
              disabled={isReserved}
            >
              {isReserved ? 'Reserved' : t("cars.card.reserve")}
            </button>
            <button 
              onClick={toggleDetails}
              className="flex-1 border border-morocco-secondary text-morocco-secondary py-2 rounded hover:bg-morocco-secondary hover:text-white transition-colors flex items-center justify-center"
            >
              <Info size={16} className={language === 'ar' ? 'ml-1' : 'mr-1'} />
              {t("cars.card.details")}
            </button>
          </div>
          
          {isReserved && (
            <div className="mt-3 text-red-600 text-sm flex items-center">
              <AlertTriangle size={16} className="mr-1" />
              This car is currently reserved
            </div>
          )}
        </div>
      </div>
      
      {/* Reservation Modal */}
      {!isReserved && (
        <ReservationModal
          isOpen={showModal}
          onClose={closeReservationModal}
          car={car}
        />
      )}
    </>
  );
};

export default CarCard;
