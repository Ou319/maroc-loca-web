
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import Layout from "@/components/Layout";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { CarType } from "@/components/CarCard";

interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  buttonText: string;
  buttonLink: string;
}

const HomePage = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [featuredCars, setFeaturedCars] = useState<CarType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Hero slides data
  const heroSlides: HeroSlide[] = [
    {
      id: 1,
      title: "SUVs for Your Adventure",
      subtitle: "Discover the great outdoors with our range of comfortable and powerful SUVs",
      image: "https://images.unsplash.com/photo-1603544741772-64d91dbe483c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      buttonText: "Explore SUVs",
      buttonLink: "/cars"
    },
    {
      id: 2,
      title: "Luxury Cars for Special Occasions",
      subtitle: "Make your special moments even more memorable with our premium vehicles",
      image: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      buttonText: "View Luxury Cars",
      buttonLink: "/cars"
    },
    {
      id: 3,
      title: "Affordable Economy Cars",
      subtitle: "Practical, fuel-efficient vehicles perfect for city exploration",
      image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      buttonText: "See Economy Cars",
      buttonLink: "/cars"
    }
  ];
  
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        // Fetch cars from the database
        const { data: carsData, error: carsError } = await supabase
          .from('cars')
          .select('*')
          .eq('status', 'available')
          .order('created_at', { ascending: false })
          .limit(3);
        
        if (carsError) throw carsError;
        
        if (carsData) {
          const formattedCars = carsData.map(car => ({
            id: car.id,
            name: car.name,
            category: car.category,
            price: car.price,
            image: car.image,
            seats: car.seats,
            transmission: car.transmission as "manual" | "automatic",
            fuel: car.fuel,
            year: car.year,
            description: car.description
          }));
          setFeaturedCars(formattedCars);
        }
      } catch (error) {
        console.error("Error fetching homepage data:", error);
        toast({
          title: "Failed to load content",
          description: "Please refresh the page to try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
    
    // Auto slide hero carousel
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <Layout>
      {/* Hero Carousel */}
      <section className="relative h-screen">
        {heroSlides.map((slide, index) => (
          <div 
            key={slide.id} 
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white px-4 max-w-4xl">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">{slide.title}</h1>
                <p className="text-xl mb-8 max-w-3xl mx-auto">{slide.subtitle}</p>
                <Link 
                  to={slide.buttonLink} 
                  className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-md font-medium transition-colors inline-flex items-center"
                >
                  {slide.buttonText}
                </Link>
              </div>
            </div>
          </div>
        ))}
        
        {/* Navigation buttons */}
        <button 
          onClick={prevSlide}
          className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/30 hover:bg-white/50 p-2 rounded-full text-white backdrop-blur-sm z-10"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/30 hover:bg-white/50 p-2 rounded-full text-white backdrop-blur-sm z-10"
        >
          <ChevronRight size={24} />
        </button>
        
        {/* Indicators */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
          {heroSlides.map((_, index) => (
            <button 
              key={index} 
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-800">Welcome to Maroc Loca Car Rentals</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-4xl mx-auto">
            At Maroc Loca, we believe every journey deserves the perfect vehicle. From luxurious rides for special
            occasions to practical cars for everyday adventures, our diverse fleet caters to your every need. With
            transparent pricing, flexible rental options, and exceptional customer service, we make car rental simple,
            convenient, and enjoyable.
          </p>
        </div>
      </section>
      
      {/* Featured Cars Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              {t("home.featured.title")}
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              {t("home.featured.subtitle")}
            </p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded mb-4 w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-10 bg-gray-200 rounded mt-6"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {featuredCars.map(car => (
                <div key={car.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <img 
                    src={car.image} 
                    alt={car.name} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-800">{car.name}</h3>
                      <span className="bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded">{car.category}</span>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-2">{car.description}</p>
                    <div className="flex justify-between items-center">
                      <p className="text-xl font-bold text-teal-600">{car.price} MAD<span className="text-sm font-normal text-gray-500">/day</span></p>
                      <Link 
                        to={`/cars/${car.id}`}
                        className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded font-medium text-sm transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link 
              to="/cars" 
              className="inline-flex items-center border-2 border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white px-6 py-3 rounded-md font-medium transition-colors"
            >
              {t("home.featured.viewAll")}
              <ChevronRight className={`ml-2 ${language === 'ar' ? 'transform rotate-180' : ''}`} />
            </Link>
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section className="py-16 md:py-24 bg-teal-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                About Maroc Loca
              </h2>
              <p className="text-white/90 mb-6 text-lg">
                Maroc Loca is Morocco's premier car rental service, providing high-quality vehicles for tourists and business travelers alike.
              </p>
              <Link 
                to="/about" 
                className="px-6 py-3 bg-white text-teal-600 rounded-md font-medium hover:bg-white/90 transition-all inline-flex items-center"
              >
                {t("home.about.learnMore")}
                <ChevronRight className={`ml-2 ${language === 'ar' ? 'transform rotate-180' : ''}`} />
              </Link>
            </div>
            
            <div className="rounded-xl overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1605102977715-c80c40a1fd72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Maroc Loca Team" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section 
        className="py-20 relative"
        style={{
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(https://images.unsplash.com/photo-1575822086889-6a0ce8c34951?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            {t("home.cta.title")}
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            {t("home.cta.subtitle")}
          </p>
          <Link 
            to="/cars" 
            className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-md font-medium transition-colors"
          >
            {t("home.cta.button")}
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
