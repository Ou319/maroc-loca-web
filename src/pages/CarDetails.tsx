
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { CarType } from "@/components/CarCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import { Calendar, Car, Fuel, Users, ArrowLeft } from "lucide-react";
import ReservationForm from "@/components/ReservationForm";

const CarDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [car, setCar] = useState<CarType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showReservation, setShowReservation] = useState(false);
  
  useEffect(() => {
    async function fetchCarDetails() {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('cars')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setCar({
            id: data.id,
            name: data.name,
            category: data.category,
            price: data.price,
            image: data.image,
            seats: data.seats,
            transmission: data.transmission as "manual" | "automatic",
            fuel: data.fuel,
            year: data.year,
            description: data.description
          });
        }
      } catch (error) {
        console.error("Error fetching car details:", error);
        toast({
          title: "Failed to load car details",
          description: "Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchCarDetails();
  }, [id]);
  
  const toggleReservation = () => {
    setShowReservation(!showReservation);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse">
              <div className="h-64 bg-gray-200 rounded-xl mb-8"></div>
              <div className="h-10 bg-gray-200 rounded mb-4 w-1/2"></div>
              <div className="h-6 bg-gray-200 rounded mb-8 w-1/3"></div>
              <div className="h-32 bg-gray-200 rounded mb-6"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!car) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Car not found</h2>
            <p className="mb-6">The car you're looking for doesn't exist or has been removed.</p>
            <Link 
              to="/cars" 
              className="inline-flex items-center bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-md font-medium transition-colors"
            >
              <ArrowLeft className="mr-2" /> Back to all cars
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Back button */}
          <Link 
            to="/cars" 
            className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium mb-8"
          >
            <ArrowLeft className="mr-2" size={18} /> Back to all cars
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Car image */}
            <div className="rounded-xl overflow-hidden shadow-md">
              <img 
                src={car.image} 
                alt={car.name} 
                className="w-full h-auto object-cover"
              />
            </div>
            
            {/* Car details */}
            <div>
              <div className="flex justify-between items-start mb-2">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{car.name}</h1>
                <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium">{car.category}</span>
              </div>
              
              <p className="text-3xl font-bold text-teal-600 mb-6">{car.price} MAD<span className="text-base font-normal text-gray-500">/day</span></p>
              
              <p className="text-gray-600 mb-8 text-lg">{car.description}</p>
              
              {/* Car features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center text-gray-600 mb-1">
                    <Calendar size={18} className="mr-2" />
                    <span>Year</span>
                  </div>
                  <p className="font-bold text-gray-800">{car.year}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center text-gray-600 mb-1">
                    <Users size={18} className="mr-2" />
                    <span>Seats</span>
                  </div>
                  <p className="font-bold text-gray-800">{car.seats}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center text-gray-600 mb-1">
                    <Car size={18} className="mr-2" />
                    <span>Transmission</span>
                  </div>
                  <p className="font-bold text-gray-800 capitalize">{car.transmission}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center text-gray-600 mb-1">
                    <Fuel size={18} className="mr-2" />
                    <span>Fuel</span>
                  </div>
                  <p className="font-bold text-gray-800">{car.fuel}</p>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={toggleReservation}
                  className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-md font-medium transition-colors flex-1 text-center"
                >
                  Reserve Now
                </button>
                <a
                  href={`https://wa.me/+212612345678?text=I'm interested in renting the ${car.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-md font-medium transition-colors flex-1 text-center"
                >
                  Contact via WhatsApp
                </a>
              </div>
            </div>
          </div>
          
          {/* Reservation form */}
          {showReservation && (
            <div className="mt-12 p-6 bg-gray-50 rounded-xl">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Reserve {car.name}</h3>
              <ReservationForm car={car} onClose={toggleReservation} />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CarDetails;
