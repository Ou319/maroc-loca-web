import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { CarType } from "@/components/CarCard";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = ["All", "Economy", "SUV", "Luxury"];

const CarsPage = () => {
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
          .in('status', ['available']);
          
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
    
    if (selectedCategory !== "All") {
      filtered = filtered.filter(car => car.category === selectedCategory);
    }
    
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
      <section 
        className="py-16 relative"
        style={{
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(https://images.unsplash.com/photo-1514267372770-c68dcc0ce206?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container mx-auto px-6 relative z-10 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Our Vehicles
          </h1>
          <p className="text-xl mb-0 max-w-3xl">
            Find the perfect car for your journey
          </p>
        </div>
      </section>
      
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {CATEGORIES.map(category => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full transition-colors ${
                  selectedCategory === category
                    ? 'bg-teal-500 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </button>
            ))}
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 mb-10 max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input 
                type="text" 
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Search by name, category or description"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {[1, 2, 3, 4, 5, 6].map(i => (
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
          ) : filteredCars.length === 0 ? (
            <div className="text-center py-10">
              <h3 className="text-xl font-medium text-gray-600 mb-2">
                No vehicles found
              </h3>
              <p className="text-gray-500">
                Try a different search term or category
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {filteredCars.map(car => (
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
                    <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-4">
                      <span>{car.seats} Seats</span>
                      <span>{car.transmission}</span>
                      <span>{car.fuel}</span>
                      <span>{car.year}</span>
                    </div>
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
        </div>
      </section>
    </Layout>
  );
};

export default CarsPage;
