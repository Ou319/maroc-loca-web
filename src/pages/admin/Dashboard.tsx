
import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Car, User, CreditCard, Calendar, ArrowUp, ArrowDown } from "lucide-react";

// Sample data for charts - would come from the database
const reservationData = [
  { month: 'Jan', reservations: 15 },
  { month: 'Feb', reservations: 20 },
  { month: 'Mar', reservations: 18 },
  { month: 'Apr', reservations: 25 },
  { month: 'May', reservations: 30 },
  { month: 'Jun', reservations: 35 },
  { month: 'Jul', reservations: 45 },
  { month: 'Aug', reservations: 50 },
  { month: 'Sep', reservations: 40 },
  { month: 'Oct', reservations: 35 },
  { month: 'Nov', reservations: 25 },
  { month: 'Dec', reservations: 30 }
];

const carCategoryData = [
  { name: 'Economy', value: 45 },
  { name: 'SUV', value: 30 },
  { name: 'Luxury', value: 25 }
];

const COLORS = ['#E06D44', '#265D97', '#F2D5B8', '#FFC857'];

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalCars: 0,
    availableCars: 0,
    totalUsers: 0,
    activeReservations: 0,
    totalReservations: 0,
    revenue: 0
  });
  
  useEffect(() => {
    // Here you would fetch data from your API
    // For now, use sample data
    setStats({
      totalCars: 75,
      availableCars: 52,
      totalUsers: 310,
      activeReservations: 18,
      totalReservations: 128,
      revenue: 45680
    });
  }, []);

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to the Maroc Loca admin dashboard.</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-morocco-primary bg-opacity-10 text-morocco-primary">
              <Car size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Cars</p>
              <p className="text-xl font-semibold">{stats.totalCars}</p>
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-green-500 flex items-center">
              <ArrowUp size={14} className="mr-1" />
              5%
            </span>
            <span className="text-gray-500 ml-2">from last month</span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <Calendar size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Reservations</p>
              <p className="text-xl font-semibold">{stats.activeReservations}</p>
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-green-500 flex items-center">
              <ArrowUp size={14} className="mr-1" />
              12%
            </span>
            <span className="text-gray-500 ml-2">from last month</span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <User size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-xl font-semibold">{stats.totalUsers}</p>
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-green-500 flex items-center">
              <ArrowUp size={14} className="mr-1" />
              8%
            </span>
            <span className="text-gray-500 ml-2">from last month</span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <CreditCard size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-xl font-semibold">{stats.revenue.toLocaleString()} MAD</p>
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-red-500 flex items-center">
              <ArrowDown size={14} className="mr-1" />
              3%
            </span>
            <span className="text-gray-500 ml-2">from last month</span>
          </div>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Reservations Chart */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h2 className="text-lg font-semibold mb-4">Reservations by Month</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={reservationData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="reservations" fill="#E06D44" name="Reservations" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Car Categories Chart */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h2 className="text-lg font-semibold mb-4">Reservations by Car Category</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={carCategoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {carCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Revenue Trend */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Revenue Trend</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={reservationData.map(item => ({ ...item, revenue: item.reservations * 1200 }))}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value.toLocaleString()} MAD`, 'Revenue']} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#265D97" activeDot={{ r: 8 }} name="Revenue (MAD)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { user: "John Doe", action: "Reserved", car: "Dacia Duster", time: "2 hours ago" },
            { user: "Alice Smith", action: "Returned", car: "Renault Clio", time: "5 hours ago" },
            { user: "Mohammed Ali", action: "Reserved", car: "Range Rover Evoque", time: "8 hours ago" },
            { user: "Sophie Martin", action: "Cancelled", car: "BMW 5 Series", time: "1 day ago" },
            { user: "Ahmed Hassan", action: "Reserved", car: "Mercedes C-Class", time: "1 day ago" }
          ].map((activity, index) => (
            <div key={index} className="flex items-center py-2 border-b border-gray-100 last:border-b-0">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-600">
                {activity.user.charAt(0)}
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium">{activity.user} <span className="text-gray-500">{activity.action}</span> {activity.car}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                activity.action === 'Reserved' ? 'bg-green-100 text-green-800' :
                activity.action === 'Returned' ? 'bg-blue-100 text-blue-800' :
                'bg-red-100 text-red-800'
              }`}>
                {activity.action}
              </span>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
