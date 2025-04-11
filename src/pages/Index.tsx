
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import Layout from "@/components/Layout";
import CarCard, { CarType } from "@/components/CarCard";
import { Star, Shield, Clock, Car, ChevronRight } from "lucide-react";

// Sample data - would come from database
const SAMPLE_CARS: CarType[] = [
  {
    id: "1",
    name: "Dacia Duster",
    category: "SUV",
    price: 400,
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    seats: 5,
    transmission: "manual",
    fuel: "Diesel",
    year: 2022,
    description: "The perfect SUV for Moroccan roads, combining comfort and practicality."
  },
  {
    id: "2",
    name: "Renault Clio",
    category: "Economy",
    price: 250,
    image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    seats: 5,
    transmission: "manual",
    fuel: "Gasoline",
    year: 2023,
    description: "Fuel-efficient and easy to drive, ideal for city exploration."
  },
  {
    id: "3",
    name: "Mercedes C-Class",
    category: "Luxury",
    price: 700,
    image: "https://images.unsplash.com/photo-1617814076229-810246fb238e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    seats: 5,
    transmission: "automatic",
    fuel: "Gasoline",
    year: 2022,
    description: "Experience luxury and performance during your stay in Morocco."
  }
];

// Sample banner data - would come from database
const HERO_DATA = {
  title: "Rent Your Perfect Car in Morocco",
  subtitle: "Experience the beauty of Morocco with our premium car rental service",
  image: "https://images.unsplash.com/photo-1603544741772-64d91dbe483c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
};

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
  const [featuredCars, setFeaturedCars] = useState<CarType[]>([]);
  
  useEffect(() => {
    // Here you would fetch data from your API
    // For now, use sample data
    setFeaturedCars(SAMPLE_CARS);
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section 
        className="relative h-screen flex items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${HERO_DATA.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container-custom relative z-10 text-white">
          <div className="max-w-3xl animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{t("home.hero.title")}</h1>
            <p className="text-xl mb-8">{t("home.hero.subtitle")}</p>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCars.map(car => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
          
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
                {t("home.about.title")}
              </h2>
              <p className="text-white/90 mb-6">
                Maroc Loca is Morocco's premier car rental service, providing high-quality vehicles for tourists and business travelers alike. With our extensive fleet of cars, from economical options to luxury vehicles, we ensure you have the perfect car for your journey.
              </p>
              <p className="text-white/90 mb-8">
                Founded with a passion for exceptional service, we've been helping visitors explore the beauty of Morocco for over 10 years.
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
                src="https://images.unsplash.com/photo-1605102977715-c80c40a1fd72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
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
