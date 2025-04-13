
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { CarType } from "@/components/CarCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import { Calendar, Car, Fuel, Users, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import ReservationForm from "@/components/ReservationForm";

interface CarImage {
  id: string;
  image_url: string;
  is_primary: boolean;
}

const CarDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [car, setCar] = useState<CarType | null>(null);
  const [carImages, setCarImages] = useState<CarImage[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showReservation, setShowReservation] = useState(false);
  const [isReserved, setIsReserved] = useState(false);
  
  useEffect(() => {
    async function fetchCarDetails() {
      if (!id) return;
      
      setIsLoading(true);
      try {
        // Fetch car details
        const { data: carData, error: carError } = await supabase
          .from('cars')
          .select('*')
          .eq('id', id)
          .single();
          
        if (carError) throw carError;
        
        // Fetch car images
        const { data: imageData, error: imageError } = await supabase
          .from('car_images')
          .select('*')
          .eq('car_id', id)
          .order('is_primary', { ascending: false });
          
        if (imageError) throw imageError;
        
        if (carData) {
          setCar({
            id: carData.id,
            name: carData.name,
            category: carData.category,
            price: carData.price,
            image: carData.image,
            seats: carData.seats,
            transmission: carData.transmission as "manual" | "automatic",
            fuel: carData.fuel,
            year: carData.year,
            description: carData.description
          });
          
          setIsReserved(carData.status === 'reserved');
          
          // Set car images, or use the default image if no images in the new table
          if (imageData && imageData.length > 0) {
            setCarImages(imageData);
          } else if (carData.image) {
            // Create a default image entry using the legacy image field
            setCarImages([{
              id: 'default',
              image_url: carData.image,
              is_primary: true
            }]);
          }
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

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === carImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? carImages.length - 1 : prevIndex - 1
    );
  };

  const changeImage = (index: number) => {
    setCurrentImageIndex(index);
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
            {/* Car image gallery */}
            <div className="rounded-xl overflow-hidden shadow-md">
              {carImages.length > 0 ? (
                <div className="relative">
                  <img 
                    src={carImages[currentImageIndex].image_url} 
                    alt={`${car.name} - Image ${currentImageIndex + 1}`} 
                    className="w-full h-96 object-cover"
                  />
                  
                  {carImages.length > 1 && (
                    <>
                      {/* Navigation arrows */}
                      <button 
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 hover:bg-opacity-60 text-white p-2 rounded-full"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button 
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 hover:bg-opacity-60 text-white p-2 rounded-full"
                      >
                        <ChevronRight size={24} />
                      </button>
                      
                      {/* Image indicators */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                        {carImages.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => changeImage(index)}
                            className={`w-3 h-3 rounded-full ${
                              index === currentImageIndex 
                                ? 'bg-white' 
                                : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                            }`}
                            aria-label={`View image ${index + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="h-96 bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500">No images available</p>
                </div>
              )}
              
              {/* Thumbnail gallery */}
              {carImages.length > 1 && (
                <div className="flex mt-4 space-x-2 overflow-x-auto pb-2">
                  {carImages.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => changeImage(index)}
                      className={`flex-shrink-0 h-20 w-20 overflow-hidden rounded-md ${
                        index === currentImageIndex ? 'ring-2 ring-teal-500' : ''
                      }`}
                    >
                      <img 
                        src={image.image_url} 
                        alt={`${car.name} thumbnail ${index + 1}`}
                        className="h-full w-full object-cover" 
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Car details */}
            <div>
              <div className="flex justify-between items-start mb-2">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{car?.name}</h1>
                <div className="flex flex-col items-end gap-2">
                  <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium">{car?.category}</span>
                  {isReserved && (
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">Reserved</span>
                  )}
                </div>
              </div>
              
              <p className="text-3xl font-bold text-teal-600 mb-6">{car?.price} MAD<span className="text-base font-normal text-gray-500">/day</span></p>
              
              <p className="text-gray-600 mb-8 text-lg">{car?.description}</p>
              
              {/* Car features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center text-gray-600 mb-1">
                    <Calendar size={18} className="mr-2" />
                    <span>Year</span>
                  </div>
                  <p className="font-bold text-gray-800">{car?.year}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center text-gray-600 mb-1">
                    <Users size={18} className="mr-2" />
                    <span>Seats</span>
                  </div>
                  <p className="font-bold text-gray-800">{car?.seats}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center text-gray-600 mb-1">
                    <Car size={18} className="mr-2" />
                    <span>Transmission</span>
                  </div>
                  <p className="font-bold text-gray-800 capitalize">{car?.transmission}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center text-gray-600 mb-1">
                    <Fuel size={18} className="mr-2" />
                    <span>Fuel</span>
                  </div>
                  <p className="font-bold text-gray-800">{car?.fuel}</p>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={toggleReservation}
                  className={`${
                    isReserved 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-teal-500 hover:bg-teal-600'
                  } text-white px-6 py-3 rounded-md font-medium transition-colors flex-1 text-center`}
                  disabled={isReserved}
                >
                  {isReserved ? 'Currently Reserved' : 'Reserve Now'}
                </button>
                <a
                  href={`https://wa.me/+212612345678?text=I'm interested in renting the ${car?.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-md font-medium transition-colors flex-1 text-center"
                >
                  Contact via WhatsApp
                </a>
              </div>
              
              {isReserved && (
                <p className="mt-4 text-red-600 text-sm">
                  This car is currently reserved. Please check back later or contact us for more information.
                </p>
              )}
            </div>
          </div>
          
          {/* Reservation form */}
          {showReservation && !isReserved && car && (
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
