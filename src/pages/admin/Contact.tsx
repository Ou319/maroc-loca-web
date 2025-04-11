
import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit, MapPin, Phone, Mail, Save, X } from "lucide-react";

interface ContactInfo {
  id: string;
  type: 'address' | 'phone' | 'email' | 'social' | 'hours';
  label: string;
  value: string;
}

// Sample data - would come from database
const SAMPLE_CONTACT_INFO: ContactInfo[] = [
  {
    id: "1",
    type: 'address',
    label: 'Main Office',
    value: '123 Avenue Hassan II, Casablanca, Morocco'
  },
  {
    id: "2",
    type: 'phone',
    label: 'Customer Service',
    value: '+212 6 12 34 56 78'
  },
  {
    id: "3",
    type: 'phone',
    label: 'WhatsApp',
    value: '+212 6 12 34 56 78'
  },
  {
    id: "4",
    type: 'email',
    label: 'General Inquiries',
    value: 'contact@marocloca.ma'
  },
  {
    id: "5",
    type: 'email',
    label: 'Reservations',
    value: 'reservations@marocloca.ma'
  },
  {
    id: "6",
    type: 'social',
    label: 'Facebook',
    value: 'https://facebook.com/marocloca'
  },
  {
    id: "7",
    type: 'social',
    label: 'Instagram',
    value: 'https://instagram.com/marocloca'
  },
  {
    id: "8",
    type: 'hours',
    label: 'Monday - Friday',
    value: '9:00 AM - 7:00 PM'
  }
];

interface LocationInfo {
  id: string;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  phone: string;
  isMainLocation: boolean;
}

// Sample locations - would come from database
const SAMPLE_LOCATIONS: LocationInfo[] = [
  {
    id: "1",
    name: "Maroc Loca - Casablanca",
    address: "123 Avenue Hassan II, Casablanca, Morocco",
    coordinates: { lat: 33.5731, lng: -7.5898 },
    phone: "+212 6 12 34 56 78",
    isMainLocation: true
  },
  {
    id: "2",
    name: "Maroc Loca - Marrakech",
    address: "45 Avenue Mohammed V, Marrakech, Morocco",
    coordinates: { lat: 31.6295, lng: -7.9811 },
    phone: "+212 6 98 76 54 32",
    isMainLocation: false
  }
];

const AdminContact = () => {
  const { toast } = useToast();
  const [contactInfo, setContactInfo] = useState<ContactInfo[]>([]);
  const [locations, setLocations] = useState<LocationInfo[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    type: 'address' | 'phone' | 'email' | 'social' | 'hours';
    label: string;
    value: string;
  }>({
    type: 'phone',
    label: '',
    value: ''
  });
  
  useEffect(() => {
    // Here you would fetch data from your API
    // For now, use sample data
    setContactInfo(SAMPLE_CONTACT_INFO);
    setLocations(SAMPLE_LOCATIONS);
  }, []);
  
  const handleAddContactInfo = () => {
    // Reset form data
    setFormData({
      type: 'phone',
      label: '',
      value: ''
    });
    
    // Enter edit mode without an item ID (means we're adding)
    setIsEditing(true);
    setEditingItemId(null);
  };
  
  const handleEditContactInfo = (item: ContactInfo) => {
    // Set form data to the selected item
    setFormData({
      type: item.type,
      label: item.label,
      value: item.value
    });
    
    // Enter edit mode with the item's ID
    setIsEditing(true);
    setEditingItemId(item.id);
  };
  
  const handleDeleteContactInfo = (id: string) => {
    // Remove the item from state
    setContactInfo(prevInfo => prevInfo.filter(item => item.id !== id));
    
    // Show success message
    toast({
      title: "Contact Info Deleted",
      description: "The contact information has been removed.",
      duration: 3000,
    });
  };
  
  const handleSaveContactInfo = () => {
    if (!formData.label || !formData.value) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    if (editingItemId) {
      // Update existing item
      setContactInfo(prevInfo => 
        prevInfo.map(item => 
          item.id === editingItemId 
            ? { ...item, ...formData } 
            : item
        )
      );
      
      toast({
        title: "Contact Info Updated",
        description: "The contact information has been updated.",
        duration: 3000,
      });
    } else {
      // Add new item
      const newItem: ContactInfo = {
        id: Math.random().toString(36).substring(2, 9),
        ...formData
      };
      
      setContactInfo(prevInfo => [...prevInfo, newItem]);
      
      toast({
        title: "Contact Info Added",
        description: "The contact information has been added.",
        duration: 3000,
      });
    }
    
    // Exit edit mode
    setIsEditing(false);
    setEditingItemId(null);
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingItemId(null);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'type') {
      // Ensure type is cast to the correct union type
      setFormData(prev => ({ 
        ...prev, 
        [name]: value as 'address' | 'phone' | 'email' | 'social' | 'hours' 
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  // Group contact info by type for easier display
  const groupedContactInfo = contactInfo.reduce((groups, item) => {
    const group = groups[item.type] || [];
    group.push(item);
    groups[item.type] = group;
    return groups;
  }, {} as Record<string, ContactInfo[]>);

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contact Management</h1>
          <p className="text-gray-600">Manage your contact information and locations.</p>
        </div>
        
        <button
          onClick={handleAddContactInfo}
          className="mt-4 md:mt-0 flex items-center bg-morocco-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
        >
          <Plus size={18} className="mr-2" />
          Add Contact Info
        </button>
      </div>
      
      {/* Add/Edit Form */}
      {isEditing && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 animate-fade-in">
          <h2 className="text-lg font-bold mb-4">
            {editingItemId ? "Edit Contact Information" : "Add Contact Information"}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-morocco-primary"
              >
                <option value="address">Address</option>
                <option value="phone">Phone</option>
                <option value="email">Email</option>
                <option value="social">Social Media</option>
                <option value="hours">Business Hours</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Label
              </label>
              <input
                type="text"
                name="label"
                value={formData.label}
                onChange={handleInputChange}
                placeholder="e.g., Main Office, Customer Service, etc."
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-morocco-primary"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Value
            </label>
            <input
              type="text"
              name="value"
              value={formData.value}
              onChange={handleInputChange}
              placeholder={
                formData.type === 'address' ? 'Full address' :
                formData.type === 'phone' ? 'Phone number' :
                formData.type === 'email' ? 'Email address' :
                formData.type === 'social' ? 'URL or username' :
                'Opening hours'
              }
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-morocco-primary"
            />
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleCancelEdit}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 mr-2"
            >
              <X size={16} className="mr-1" />
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveContactInfo}
              className="flex items-center px-4 py-2 bg-morocco-primary text-white rounded-md hover:bg-opacity-90 transition-colors"
            >
              <Save size={16} className="mr-1" />
              Save
            </button>
          </div>
        </div>
      )}
      
      {/* Contact Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {['address', 'phone', 'email', 'social', 'hours'].map(type => (
          <div key={type} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h2 className="font-bold text-gray-800 capitalize">{type === 'social' ? 'Social Media' : `${type}es`}</h2>
            </div>
            
            <div className="p-4">
              {groupedContactInfo[type] && groupedContactInfo[type].length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {groupedContactInfo[type].map(item => (
                    <div key={item.id} className="py-3 flex items-center justify-between">
                      <div className="flex items-start">
                        <div className="mr-3 text-morocco-primary">
                          {type === 'address' && <MapPin size={20} />}
                          {type === 'phone' && <Phone size={20} />}
                          {type === 'email' && <Mail size={20} />}
                          {/* Add icons for social and hours if needed */}
                        </div>
                        <div>
                          <p className="font-medium">{item.label}</p>
                          <p className="text-gray-600 text-sm">{item.value}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditContactInfo(item)}
                          className="p-1 rounded-md hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteContactInfo(item.id)}
                          className="p-1 rounded-md hover:bg-gray-100 text-gray-600 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic text-center py-4">
                  No {type} information added yet.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Locations Management */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Locations</h2>
          <button className="flex items-center text-morocco-primary hover:underline">
            <Plus size={16} className="mr-1" />
            Add Location
          </button>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {locations.map((location) => (
                  <tr key={location.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">
                      {location.name}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {location.address}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {location.phone}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        location.isMainLocation ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {location.isMainLocation ? 'Main Location' : 'Branch'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          className="p-1 rounded-md hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                          title="Edit location"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="p-1 rounded-md hover:bg-gray-100 text-gray-600 hover:text-red-600"
                          title="Delete location"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Map Preview */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <h2 className="text-lg font-bold mb-4">Map Preview</h2>
        <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
          <p className="text-gray-600">Map preview would be displayed here.</p>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          The map will automatically update on the website to show all your active locations.
        </p>
      </div>
    </AdminLayout>
  );
};

export default AdminContact;
