import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Check,
  X,
  Filter
} from "lucide-react";
import { CarType } from "@/components/CarCard";

// Extended car type for admin
interface AdminCar extends CarType {
  status: 'available' | 'reserved' | 'hidden';
  added: string; // date
  reservations: number;
}

// Sample data - would come from database
const SAMPLE_CARS: AdminCar[] = [
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
    description: "The perfect SUV for Moroccan roads, combining comfort and practicality.",
    status: 'available',
    added: '2023-10-15',
    reservations: 24
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
    description: "Fuel-efficient and easy to drive, ideal for city exploration.",
    status: 'available',
    added: '2023-11-05',
    reservations: 36
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
    description: "Experience luxury and performance during your stay in Morocco.",
    status: 'reserved',
    added: '2023-09-20',
    reservations: 15
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
    description: "A premium SUV with exceptional off-road capabilities.",
    status: 'hidden',
    added: '2023-08-12',
    reservations: 8
  }
];

const CATEGORIES = ["All", "Economy", "SUV", "Luxury"];
const STATUS_OPTIONS = ["All", "Available", "Reserved", "Hidden"];

const AdminCars = () => {
  const { toast } = useToast();
  const [cars, setCars] = useState<AdminCar[]>([]);
  const [filteredCars, setFilteredCars] = useState<AdminCar[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState<AdminCar | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "Economy",
    price: 0,
    image: "",
    seats: 5,
    transmission: "manual" as "manual" | "automatic",
    fuel: "Gasoline",
    year: new Date().getFullYear(),
    description: ""
  });
  
  useEffect(() => {
    setCars(SAMPLE_CARS);
    setFilteredCars(SAMPLE_CARS);
  }, []);
  
  useEffect(() => {
    let filtered = cars;
    
    if (selectedCategory !== "All") {
      filtered = filtered.filter(car => car.category === selectedCategory);
    }
    
    if (selectedStatus !== "All") {
      const status = selectedStatus.toLowerCase() as 'available' | 'reserved' | 'hidden';
      filtered = filtered.filter(car => car.status === status);
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
  }, [selectedCategory, selectedStatus, searchTerm, cars]);
  
  const handleAddCar = () => {
    const newId = Math.random().toString(36).substring(2, 9);
    
    const newCar: AdminCar = {
      id: newId,
      ...formData,
      status: 'available',
      added: new Date().toISOString().split('T')[0],
      reservations: 0
    };
    
    setCars(prevCars => [...prevCars, newCar]);
    
    toast({
      title: "Car Added",
      description: `${formData.name} has been added to your fleet.`,
      duration: 3000,
    });
    
    setFormData({
      name: "",
      category: "Economy",
      price: 0,
      image: "",
      seats: 5,
      transmission: "manual",
      fuel: "Gasoline",
      year: new Date().getFullYear(),
      description: ""
    });
    setShowAddModal(false);
  };
  
  const handleEditCar = (car: AdminCar) => {
    setSelectedCar(car);
    setFormData({
      name: car.name,
      category: car.category,
      price: car.price,
      image: car.image,
      seats: car.seats,
      transmission: car.transmission,
      fuel: car.fuel,
      year: car.year,
      description: car.description
    });
    setShowAddModal(true);
  };
  
  const handleUpdateCar = () => {
    if (!selectedCar) return;
    
    setCars(prevCars => 
      prevCars.map(car => 
        car.id === selectedCar.id 
          ? { ...car, ...formData } 
          : car
      )
    );
    
    toast({
      title: "Car Updated",
      description: `${formData.name} has been updated.`,
      duration: 3000,
    });
    
    setFormData({
      name: "",
      category: "Economy",
      price: 0,
      image: "",
      seats: 5,
      transmission: "manual",
      fuel: "Gasoline",
      year: new Date().getFullYear(),
      description: ""
    });
    setSelectedCar(null);
    setShowAddModal(false);
  };
  
  const handleDeleteCar = (car: AdminCar) => {
    setSelectedCar(car);
    setShowDeleteModal(true);
  };
  
  const confirmDelete = () => {
    if (!selectedCar) return;
    
    setCars(prevCars => prevCars.filter(car => car.id !== selectedCar.id));
    
    toast({
      title: "Car Deleted",
      description: `${selectedCar.name} has been removed from your fleet.`,
      duration: 3000,
    });
    
    setSelectedCar(null);
    setShowDeleteModal(false);
  };
  
  const toggleCarVisibility = (car: AdminCar) => {
    const newStatus = car.status === 'hidden' ? 'available' : 'hidden';
    
    setCars(prevCars => 
      prevCars.map(c => 
        c.id === car.id 
          ? { ...c, status: newStatus } 
          : c
      )
    );
    
    toast({
      title: newStatus === 'hidden' ? "Car Hidden" : "Car Visible",
      description: `${car.name} is now ${newStatus === 'hidden' ? 'hidden from' : 'visible on'} the website.`,
      duration: 3000,
    });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'transmission') {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value as "manual" | "automatic" 
      }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        [name]: name === 'price' || name === 'seats' || name === 'year' ? Number(value) : value 
      }));
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Car Management</h1>
          <p className="text-gray-600">Manage your fleet of rental cars.</p>
        </div>
        
        <button
          onClick={() => {
            setSelectedCar(null);
            setFormData({
              name: "",
              category: "Economy",
              price: 0,
              image: "",
              seats: 5,
              transmission: "manual",
              fuel: "Gasoline",
              year: new Date().getFullYear(),
              description: ""
            });
            setShowAddModal(true);
          }}
          className="mt-4 md:mt-0 flex items-center bg-morocco-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
        >
          <Plus size={18} className="mr-2" />
          Add New Car
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input 
              type="text" 
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5 focus:outline-none focus:ring-2 focus:ring-morocco-primary"
              placeholder="Search cars..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="w-full md:w-auto">
            <label className="inline-flex items-center">
              <Filter size={16} className="mr-2 text-gray-500" />
              <span className="text-sm text-gray-500 mr-2">Category:</span>
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5 focus:outline-none focus:ring-2 focus:ring-morocco-primary"
            >
              {CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div className="w-full md:w-auto">
            <label className="inline-flex items-center">
              <Filter size={16} className="mr-2 text-gray-500" />
              <span className="text-sm text-gray-500 mr-2">Status:</span>
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5 focus:outline-none focus:ring-2 focus:ring-morocco-primary"
            >
              {STATUS_OPTIONS.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price/Day</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reservations</th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCars.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-500">
                    No cars found. Try adjusting your filters or add a new car.
                  </td>
                </tr>
              ) : (
                filteredCars.map(car => (
                  <tr key={car.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 flex-shrink-0 mr-3">
                          <img 
                            src={car.image} 
                            alt={car.name}
                            className="w-10 h-10 rounded-md object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{car.name}</p>
                          <p className="text-xs text-gray-500">{car.year} • {car.transmission}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100">
                        {car.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium">
                      {car.price} MAD
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        car.status === 'available' ? 'bg-green-100 text-green-800' :
                        car.status === 'reserved' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {car.status.charAt(0).toUpperCase() + car.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {car.reservations}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => toggleCarVisibility(car)}
                          className="p-1 rounded-md hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                          title={car.status === 'hidden' ? "Show car" : "Hide car"}
                        >
                          {car.status === 'hidden' ? <Eye size={18} /> : <EyeOff size={18} />}
                        </button>
                        <button
                          onClick={() => handleEditCar(car)}
                          className="p-1 rounded-md hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                          title="Edit car"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteCar(car)}
                          className="p-1 rounded-md hover:bg-gray-100 text-gray-600 hover:text-red-600"
                          title="Delete car"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-xl font-bold text-morocco-secondary">
                {selectedCar ? "Edit Car" : "Add New Car"}
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Car Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-morocco-primary"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-morocco-primary"
                    required
                  >
                    <option value="Economy">Economy</option>
                    <option value="SUV">SUV</option>
                    <option value="Luxury">Luxury</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (MAD/day)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-morocco-primary"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year
                  </label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-morocco-primary"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Seats
                  </label>
                  <input
                    type="number"
                    name="seats"
                    value={formData.seats}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-morocco-primary"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Transmission
                  </label>
                  <select
                    name="transmission"
                    value={formData.transmission}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-morocco-primary"
                    required
                  >
                    <option value="manual">Manual</option>
                    <option value="automatic">Automatic</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fuel Type
                  </label>
                  <select
                    name="fuel"
                    value={formData.fuel}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-morocco-primary"
                    required
                  >
                    <option value="Gasoline">Gasoline</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-morocco-primary"
                  placeholder="https://example.com/car-image.jpg"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter a URL for the car image. You can use services like Unsplash or your own hosting.
                </p>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-morocco-primary"
                  required
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 mr-2"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={selectedCar ? handleUpdateCar : handleAddCar}
                  className="px-4 py-2 bg-morocco-primary text-white rounded-md hover:bg-opacity-90 transition-colors"
                >
                  {selectedCar ? "Update Car" : "Add Car"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {showDeleteModal && selectedCar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Confirm Deletion</h3>
              <p className="mb-6">
                Are you sure you want to delete <span className="font-semibold">{selectedCar.name}</span>? This action cannot be undone.
              </p>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 mr-2"
                >
                  <X size={16} className="mr-1" />
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  <Trash2 size={16} className="mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminCars;
