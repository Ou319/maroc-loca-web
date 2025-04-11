
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import Layout from "@/components/Layout";
import CarCard, { CarType } from "@/components/CarCard";
import { Search } from "lucide-react";

// Expanded sample data - would come from database
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
  },
  {
    id: "4",
    name: "Range Rover Evoque",
    category: "SUV",
    price: 800,
    image: "https://images.unsplash.com/photo-1551522355-5d3a5c3221b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    seats: 5,
    transmission: "automatic",
    fuel: "Diesel",
    year: 2023,
    description: "A premium SUV with exceptional off-road capabilities."
  },
  {
    id: "5",
    name: "Fiat 500",
    category: "Economy",
    price: 200,
    image: "https://images.unsplash.com/photo-1592194869945-e2c8c8678606?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    seats: 4,
    transmission: "manual",
    fuel: "Gasoline",
    year: 2022,
    description: "Compact and stylish, perfect for navigating narrow city streets."
  },
  {
    id: "6",
    name: "BMW 5 Series",
    category: "Luxury",
    price: 850,
    image: "https://images.unsplash.com/photo-1520050364275-eba06a0153ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    seats: 5,
    transmission: "automatic",
    fuel: "Gasoline",
    year: 2023,
    description: "Combining luxury with driving pleasure for a premium experience."
  }
];

const CATEGORIES = ["All", "Economy", "SUV", "Luxury"];

const CarsPage = () => {
  const { t } = useLanguage();
  const [cars, setCars] = useState<CarType[]>([]);
  const [filteredCars, setFilteredCars] = useState<CarType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    // Here you would fetch data from your API
    // For now, use sample data
    setCars(SAMPLE_CARS);
    setFilteredCars(SAMPLE_CARS);
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
          {filteredCars.length === 0 ? (
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
