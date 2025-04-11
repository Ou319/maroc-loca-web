
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import Layout from "@/components/Layout";
import CarCard, { CarType } from "@/components/CarCard";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = ["All", "Economy", "SUV", "Luxury"];

const CarsPage = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [cars, setCars] = useState<CarType[]>([]);
  const [filteredCars, setFilteredCars] = useState<CarType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function fetchCars() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('cars')
          .select('*')
          .eq('status', 'available');
          
        if (error) throw error;
        
        if (data) {
          const formattedCars = data.map(car => ({
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
          setCars(formattedCars);
          setFilteredCars(formattedCars);
        }
      } catch (error) {
        console.error("Error fetching cars:", error);
        toast({
          title: "Failed to load cars",
          description: "Please refresh the page to try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchCars();
  }, []);
  
  useEffect(() => {
    let filtered = cars;
    
    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(car => car.category === selectedCategory);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(car => 
        car.name.toLowerCase().includes(term) || 
        car.category.toLowerCase().includes(term) ||
        car.description.toLowerCase().includes(term)
      );
    }
    
    setFilteredCars(filtered);
  }, [selectedCategory, searchTerm, cars]);
  
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section 
        className="py-20 relative"
        style={{
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(https://images.unsplash.com/photo-1514267372770-c68dcc0ce206?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container-custom relative z-10 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t("cars.title")}
          </h1>
          <p className="text-xl mb-0 max-w-3xl">
            {t("cars.subtitle")}
          </p>
        </div>
      </section>
      
      {/* Cars Section */}
      <section className="section">
        <div className="container-custom">
          {/* Filters */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input 
                  type="text" 
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5 focus:outline-none focus:ring-2 focus:ring-morocco-primary"
                  placeholder={t("cars.search")}
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
              
              {/* Category Tabs */}
              <div className="col-span-2">
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(category => (
                    <button
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        selectedCategory === category 
                          ? "bg-morocco-primary text-white" 
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {category === "All" ? t("cars.filter.all") : category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Cars Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
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
          ) : filteredCars.length === 0 ? (
            <div className="text-center py-10">
              <h3 className="text-xl font-medium text-gray-600 mb-2">
                {t("cars.noResults")}
              </h3>
              <p className="text-gray-500">
                {t("cars.tryDifferent")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCars.map(car => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default CarsPage;
