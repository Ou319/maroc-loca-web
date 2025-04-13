
import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Check, 
  X, 
  Phone,
  Calendar,
  Filter,
  Trash2
} from "lucide-react";
import { fetchUsers, updateReservationStatus, deleteUser, User, Reservation } from "@/services/userService";
import { useLanguage } from "@/contexts/LanguageContext";

const STATUS_OPTIONS = ["All", "Pending", "Confirmed", "Completed", "Cancelled"];

const AdminUsers = () => {
  const { toast } = useToast();
  const { language } = useLanguage();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  useEffect(() => {
    loadUsers();
  }, []);
  
  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const usersData = await fetchUsers();
      setUsers(usersData);
      setFilteredUsers(usersData);
    } catch (error) {
      console.error("Failed to load users:", error);
      toast({
        title: "Error",
        description: "Failed to load user data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    let filtered = users;
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(user => 
        user.firstName.toLowerCase().includes(term) || 
        user.lastName.toLowerCase().includes(term) ||
        user.phone.includes(term) ||
        user.city.toLowerCase().includes(term)
      );
    }
    
    // Filter by reservation status
    if (selectedStatus !== "All") {
      const status = selectedStatus.toLowerCase() as 'pending' | 'confirmed' | 'completed' | 'cancelled';
      filtered = filtered.filter(user => 
        user.reservations.some(r => r.status === status)
      );
    }
    
    setFilteredUsers(filtered);
  }, [searchTerm, selectedStatus, users]);
  
  const toggleUserExpand = (userId: string) => {
    setExpandedUserId(expandedUserId === userId ? null : userId);
  };
  
  const handleUpdateReservation = async (userId: string, reservationId: string, updates: any) => {
    try {
      const success = await updateReservationStatus(reservationId, updates);
      
      if (success) {
        // Update local state
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === userId 
              ? {
                  ...user,
                  reservations: user.reservations.map(res => 
                    res.id === reservationId 
                      ? { ...res, ...transformUpdates(updates) } 
                      : res
                  )
                } 
              : user
          )
        );
        
        // Show success message
        toast({
          title: "Reservation Updated",
          description: "The reservation status has been updated.",
          duration: 3000,
        });
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      console.error("Error updating reservation:", error);
      toast({
        title: "Update Failed",
        description: "Could not update the reservation. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user and all their reservations?')) {
      setIsDeleting(userId);
      try {
        const success = await deleteUser(userId);
        
        if (success) {
          // Remove user from local state
          setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
          setFilteredUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
          
          // Show success message
          toast({
            title: "User Deleted",
            description: "The user and their reservations have been deleted.",
            duration: 3000,
          });
        } else {
          throw new Error("Delete failed");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        toast({
          title: "Delete Failed",
          description: "Could not delete the user. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsDeleting(null);
      }
    }
  };
  
  // Transform backend update format to frontend format
  const transformUpdates = (updates: any): Partial<Reservation> => {
    const transformed: Partial<Reservation> = {};
    
    if (updates.status) transformed.status = updates.status;
    if ('first_confirmation' in updates) transformed.firstConfirmation = updates.first_confirmation;
    if ('second_confirmation' in updates) transformed.secondConfirmation = updates.second_confirmation;
    
    return transformed;
  };
  
  const confirmFirstStep = (userId: string, reservationId: string) => {
    handleUpdateReservation(userId, reservationId, { 
      status: 'confirmed',
      first_confirmation: true
    });
  };
  
  const confirmSecondStep = (userId: string, reservationId: string) => {
    handleUpdateReservation(userId, reservationId, { 
      status: 'completed',
      second_confirmation: true
    });
  };
  
  const cancelReservation = (userId: string, reservationId: string) => {
    handleUpdateReservation(userId, reservationId, { 
      status: 'cancelled'
    });
  };
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600">Manage users and their reservations.</p>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          {/* Search */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input 
              type="text" 
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5 focus:outline-none focus:ring-2 focus:ring-morocco-primary"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Status Filter */}
          <div className="w-full md:w-auto">
            <label className="inline-flex items-center">
              <Filter size={16} className="mr-2 text-gray-500" />
              <span className="text-sm text-gray-500 mr-2">Reservation Status:</span>
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
      
      {/* Users List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-gray-300 border-t-morocco-primary rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">Loading user data...</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredUsers.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No users found. Try adjusting your search filters.
              </div>
            ) : (
              filteredUsers.map(user => (
                <div key={user.id} className="overflow-hidden">
                  {/* User Row */}
                  <div 
                    className={`p-4 hover:bg-gray-50 ${
                      expandedUserId === user.id ? 'bg-gray-50' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div 
                        className="flex items-center cursor-pointer" 
                        onClick={() => toggleUserExpand(user.id)}
                      >
                        <div className="w-10 h-10 rounded-full bg-morocco-primary text-white flex items-center justify-center font-bold">
                          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <h3 className="font-medium text-gray-900">{user.firstName} {user.lastName}</h3>
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <Phone size={14} className="mr-1" />
                            {user.phone}
                            <span className="mx-2">•</span>
                            {user.city}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="text-sm text-gray-500 mr-4">
                          {user.reservations.length} {user.reservations.length === 1 ? 'reservation' : 'reservations'}
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          user.reservations.length > 0 
                            ? getStatusBadgeClass(user.reservations[0].status)
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.reservations.length > 0 
                            ? user.reservations[0].status.charAt(0).toUpperCase() + user.reservations[0].status.slice(1)
                            : 'No Reservations'}
                        </span>
                        
                        {/* Delete User Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteUser(user.id);
                          }}
                          disabled={isDeleting === user.id}
                          className="ml-3 text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                          title="Delete User"
                        >
                          {isDeleting === user.id ? (
                            <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Expanded Reservations */}
                  {expandedUserId === user.id && (
                    <div className="bg-gray-50 p-4 border-t border-gray-200 animate-fade-in">
                      <h4 className="font-medium text-gray-900 mb-4">Reservations</h4>
                      
                      {user.reservations.length === 0 ? (
                        <p className="text-gray-500 italic">This user has no reservations.</p>
                      ) : (
                        <div className="space-y-4">
                          {user.reservations.map(reservation => (
                            <div key={reservation.id} className="bg-white rounded-lg shadow-sm p-4">
                              <div className="flex flex-col md:flex-row md:items-center">
                                <div className="flex items-center mb-4 md:mb-0 md:mr-6">
                                  <div className="w-16 h-16 flex-shrink-0 mr-4">
                                    <img 
                                      src={reservation.carImage} 
                                      alt={reservation.carName}
                                      className="w-16 h-16 rounded-md object-cover"
                                    />
                                  </div>
                                  <div>
                                    <h5 className="font-medium">{reservation.carName}</h5>
                                    <p className="text-sm text-gray-500 flex items-center mt-1">
                                      <Calendar size={14} className="mr-1" />
                                      {reservation.startDate} to {reservation.endDate}
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="flex-1 flex flex-col md:flex-row md:items-center md:justify-end space-y-2 md:space-y-0 md:space-x-4">
                                  <span className={`px-3 py-1 text-xs rounded-full ${getStatusBadgeClass(reservation.status)}`}>
                                    {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                                  </span>
                                  
                                  {reservation.status !== 'cancelled' && (
                                    <div className="flex space-x-2">
                                      {!reservation.firstConfirmation && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            confirmFirstStep(user.id, reservation.id);
                                          }}
                                          className="flex items-center px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                                        >
                                          <Check size={14} className="mr-1" />
                                          Confirm Call
                                        </button>
                                      )}
                                      
                                      {reservation.firstConfirmation && !reservation.secondConfirmation && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            confirmSecondStep(user.id, reservation.id);
                                          }}
                                          className="flex items-center px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                                        >
                                          <Check size={14} className="mr-1" />
                                          Confirm Pickup
                                        </button>
                                      )}
                                      
                                      {!reservation.secondConfirmation && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            cancelReservation(user.id, reservation.id);
                                          }}
                                          className="flex items-center px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                                        >
                                          <X size={14} className="mr-1" />
                                          Cancel
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {/* Confirmation Status */}
                              <div className="mt-4 flex items-center space-x-6">
                                <div className="flex items-center">
                                  <div className={`w-4 h-4 rounded-full mr-2 ${
                                    reservation.firstConfirmation ? 'bg-green-500' : 'bg-gray-300'
                                  }`}></div>
                                  <span className="text-sm">Confirmation Call</span>
                                </div>
                                <div className="flex items-center">
                                  <div className={`w-4 h-4 rounded-full mr-2 ${
                                    reservation.secondConfirmation ? 'bg-green-500' : 'bg-gray-300'
                                  }`}></div>
                                  <span className="text-sm">Car Picked Up</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
