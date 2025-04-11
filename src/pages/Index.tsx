
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import Layout from "@/components/Layout";
import CarCard, { CarType } from "@/components/CarCard";
import { Star, Shield, Clock, Car, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface HeroContent {
  title: string;
  subtitle: string;
  image: string;
}

interface AboutContent {
  title: string;
  subtitle: string;
  content: string;
  image: string;
}

// Sample feature data - would be retrieved from database in a real app
const FEATURES_DATA = [
  {
    icon: <Star className="w-10 h-10 text-morocco-primary" />,
    title: "Top Quality Vehicles",
    description: "All our cars are regularly maintained and kept in excellent condition."
  },
  {
    icon: <Shield className="w-10 h-10 text-morocco-primary" />,
    title: "Fully Insured",
    description: "Every rental includes comprehensive insurance for your peace of mind."
  },
  {
    icon: <Clock className="w-10 h-10 text-morocco-primary" />,
    title: "24/7 Support",
    description: "Our team is available around the clock to assist you during your journey."
  },
  {
    icon: <Car className="w-10 h-10 text-morocco-primary" />,
    title: "Flexible Rental Options",
    description: "Choose from daily, weekly, or monthly rental plans that fit your schedule."
  }
];

const HomePage = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [featuredCars, setFeaturedCars] = useState<CarType[]>([]);
  const [heroContent, setHeroContent] = useState<HeroContent>({
    title: "Rent Your Perfect Car in Morocco",
    subtitle: "Experience the beauty of Morocco with our premium car rental service",
    image: "https://images.unsplash.com/photo-1603544741772-64d91dbe483c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
  });
  const [aboutContent, setAboutContent] = useState<AboutContent>({
    title: "About Maroc Loca",
    subtitle: "Your trusted partner for exploring Morocco",
    content: "Maroc Loca is Morocco's premier car rental service, providing high-quality vehicles for tourists and business travelers alike.",
    image: "https://images.unsplash.com/photo-1605102977715-c80c40a1fd72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  });
  const [isLoading, setIsLoading] = useState(true);
  
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
        
        // Fetch hero content
        const { data: heroData, error: heroError } = await supabase
          .from('homepage_content')
          .select('*')
          .eq('section', 'hero')
          .single();
          
        if (heroError && heroError.code !== 'PGRST116') throw heroError;
        
        if (heroData) {
          setHeroContent({
            title: heroData.title || heroContent.title,
            subtitle: heroData.subtitle || heroContent.subtitle,
            image: heroData.image || heroContent.image
          });
        }
        
        // Fetch about content
        const { data: aboutData, error: aboutError } = await supabase
          .from('homepage_content')
          .select('*')
          .eq('section', 'about')
          .single();
          
        if (aboutError && aboutError.code !== 'PGRST116') throw aboutError;
        
        if (aboutData) {
          setAboutContent({
            title: aboutData.title || aboutContent.title,
            subtitle: aboutData.subtitle || aboutContent.subtitle,
            content: aboutData.content || aboutContent.content,
            image: aboutData.image || aboutContent.image
          });
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
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section 
        className="relative h-screen flex items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroContent.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container-custom relative z-10 text-white">
          <div className="max-w-3xl animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{heroContent.title}</h1>
            <p className="text-xl mb-8">{heroContent.subtitle}</p>
            <Link 
              to="/cars" 
              className="btn-primary inline-flex items-center"
            >
              {t("home.hero.cta")}
              <ChevronRight className={`ml-2 ${language === 'ar' ? 'transform rotate-180' : ''}`} />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("home.featured.title")}
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              {t("home.featured.subtitle")}
            </p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="car-card animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-6 bg-gray-200 rounded mb-4 w-3/4"></div>
                    <div className="flex flex-wrap gap-3 mb-4">
                      {[1, 2, 3, 4].map(j => (
                        <div key={j} className="h-6 bg-gray-200 rounded w-16"></div>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <div className="h-10 bg-gray-200 rounded flex-1"></div>
                      <div className="h-10 bg-gray-200 rounded flex-1"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCars.map(car => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          )}
          
          <div className="text-center mt-10">
            <Link 
              to="/cars" 
              className="btn-outline inline-flex items-center"
            >
              {t("home.featured.viewAll")}
              <ChevronRight className={`ml-2 ${language === 'ar' ? 'transform rotate-180' : ''}`} />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="section">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("home.features.title")}
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              {t("home.features.subtitle")}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES_DATA.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-xl shadow-md transition-transform hover:transform hover:-translate-y-2"
              >
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* About Us Teaser */}
      <section className="section bg-morocco-primary text-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {aboutContent.title}
              </h2>
              <p className="text-white/90 mb-6">
                {aboutContent.content}
              </p>
              <Link 
                to="/about" 
                className="px-6 py-3 bg-white text-morocco-primary rounded-md font-medium hover:bg-white/90 transition-all inline-flex items-center"
              >
                {t("home.about.learnMore")}
                <ChevronRight className={`ml-2 ${language === 'ar' ? 'transform rotate-180' : ''}`} />
              </Link>
            </div>
            
            <div className="rounded-xl overflow-hidden shadow-xl">
              <img 
                src={aboutContent.image}
                alt="Maroc Loca Team" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("home.testimonials.title")}
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              {t("home.testimonials.subtitle")}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((_, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-xl shadow-md relative"
              >
                <div className="absolute -top-4 left-6 text-morocco-primary text-6xl">"</div>
                <p className="text-gray-600 mb-6 pt-6">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gray-300 mr-4"></div>
                  <div>
                    <h4 className="font-bold">John Doe</h4>
                    <p className="text-sm text-gray-500">France</p>
                  </div>
                </div>
              </div>
            ))}
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
        <div className="container-custom relative z-10 text-center text-white">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            {t("home.cta.title")}
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            {t("home.cta.subtitle")}
          </p>
          <Link 
            to="/cars" 
            className="btn-primary"
          >
            {t("home.cta.button")}
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
