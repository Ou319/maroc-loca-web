
import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useTheme } from "@/contexts/ThemeContext";
import { 
  BarChart as BarChartIcon,
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
import { 
  fetchDashboardStats, 
  fetchReservationsByMonth, 
  fetchCarCategories, 
  fetchRecentActivity,
  DashboardStats,
  ReservationData,
  CarCategoryData,
  RecentActivity
} from "@/services/dashboardService";

const COLORS = ['#E06D44', '#265D97', '#F2D5B8', '#FFC857'];

const AdminDashboard = () => {
  const { theme } = useTheme();
  const [stats, setStats] = useState<DashboardStats>({
    totalCars: 0,
    availableCars: 0,
    totalUsers: 0,
    activeReservations: 0,
    totalReservations: 0,
    revenue: 0,
    revenueChange: 0,
    carsChange: 0,
    usersChange: 0,
    reservationsChange: 0
  });
  const [reservationData, setReservationData] = useState<ReservationData[]>([]);
  const [carCategoryData, setCarCategoryData] = useState<CarCategoryData[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch all dashboard data in parallel
        const [stats, reservations, categories, activity] = await Promise.all([
          fetchDashboardStats(),
          fetchReservationsByMonth(),
          fetchCarCategories(),
          fetchRecentActivity()
        ]);
        
        setStats(stats);
        setReservationData(reservations);
        setCarCategoryData(categories);
        setRecentActivity(activity);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDashboardData();
  }, []);

  // Determine text and background colors based on theme
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textMutedColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-100';
  const chartGridColor = theme === 'dark' ? '#444' : '#ccc';

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className={`text-2xl font-bold ${textColor}`}>Dashboard</h1>
        <p className={textMutedColor}>Welcome to the Maroc Loca admin dashboard.</p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-morocco-primary"></div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className={`${cardBg} rounded-xl shadow-sm p-4`}>
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-morocco-primary bg-opacity-10 text-morocco-primary">
                  <Car size={24} />
                </div>
                <div className="ml-4">
                  <p className={`text-sm font-medium ${textMutedColor}`}>Total Cars</p>
                  <p className={`text-xl font-semibold ${textColor}`}>{stats.totalCars}</p>
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm">
                <span className="text-green-500 flex items-center">
                  <ArrowUp size={14} className="mr-1" />
                  {stats.carsChange}%
                </span>
                <span className={`${textMutedColor} ml-2`}>from last month</span>
              </div>
            </div>
            
            <div className={`${cardBg} rounded-xl shadow-sm p-4`}>
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <Calendar size={24} />
                </div>
                <div className="ml-4">
                  <p className={`text-sm font-medium ${textMutedColor}`}>Active Reservations</p>
                  <p className={`text-xl font-semibold ${textColor}`}>{stats.activeReservations}</p>
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm">
                <span className="text-green-500 flex items-center">
                  <ArrowUp size={14} className="mr-1" />
                  {stats.reservationsChange}%
                </span>
                <span className={`${textMutedColor} ml-2`}>from last month</span>
              </div>
            </div>
            
            <div className={`${cardBg} rounded-xl shadow-sm p-4`}>
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <User size={24} />
                </div>
                <div className="ml-4">
                  <p className={`text-sm font-medium ${textMutedColor}`}>Total Users</p>
                  <p className={`text-xl font-semibold ${textColor}`}>{stats.totalUsers}</p>
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm">
                <span className="text-green-500 flex items-center">
                  <ArrowUp size={14} className="mr-1" />
                  {stats.usersChange}%
                </span>
                <span className={`${textMutedColor} ml-2`}>from last month</span>
              </div>
            </div>
            
            <div className={`${cardBg} rounded-xl shadow-sm p-4`}>
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                  <CreditCard size={24} />
                </div>
                <div className="ml-4">
                  <p className={`text-sm font-medium ${textMutedColor}`}>Total Revenue</p>
                  <p className={`text-xl font-semibold ${textColor}`}>{stats.revenue.toLocaleString()} MAD</p>
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm">
                <span className="text-red-500 flex items-center">
                  <ArrowDown size={14} className="mr-1" />
                  {Math.abs(stats.revenueChange)}%
                </span>
                <span className={`${textMutedColor} ml-2`}>from last month</span>
              </div>
            </div>
          </div>
          
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Reservations Chart */}
            <div className={`${cardBg} rounded-xl shadow-sm p-4`}>
              <h2 className={`text-lg font-semibold mb-4 ${textColor}`}>Reservations by Month</h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={reservationData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
                    <XAxis dataKey="month" stroke={theme === 'dark' ? '#ccc' : '#666'} />
                    <YAxis stroke={theme === 'dark' ? '#ccc' : '#666'} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme === 'dark' ? '#1f2937' : '#fff',
                        borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
                        color: theme === 'dark' ? '#fff' : '#000'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="reservations" fill="#E06D44" name="Reservations" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Car Categories Chart */}
            <div className={`${cardBg} rounded-xl shadow-sm p-4`}>
              <h2 className={`text-lg font-semibold mb-4 ${textColor}`}>Reservations by Car Category</h2>
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
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme === 'dark' ? '#1f2937' : '#fff',
                        borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
                        color: theme === 'dark' ? '#fff' : '#000'
                      }}
                    />
                    <Legend 
                      formatter={(value) => <span style={{ color: theme === 'dark' ? '#ccc' : '#666' }}>{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          {/* Revenue Trend */}
          <div className={`${cardBg} rounded-xl shadow-sm p-4 mb-6`}>
            <h2 className={`text-lg font-semibold mb-4 ${textColor}`}>Revenue Trend</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={reservationData.map(item => ({ ...item, revenue: item.reservations * 1200 }))}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
                  <XAxis dataKey="month" stroke={theme === 'dark' ? '#ccc' : '#666'} />
                  <YAxis stroke={theme === 'dark' ? '#ccc' : '#666'} />
                  <Tooltip 
                    formatter={(value) => [`${value.toLocaleString()} MAD`, 'Revenue']}
                    contentStyle={{
                      backgroundColor: theme === 'dark' ? '#1f2937' : '#fff',
                      borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
                      color: theme === 'dark' ? '#fff' : '#000'
                    }}
                  />
                  <Legend 
                    formatter={(value) => <span style={{ color: theme === 'dark' ? '#ccc' : '#666' }}>{value}</span>}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#265D97" activeDot={{ r: 8 }} name="Revenue (MAD)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className={`${cardBg} rounded-xl shadow-sm p-4`}>
            <h2 className={`text-lg font-semibold mb-4 ${textColor}`}>Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={activity.id} className={`flex items-center py-2 border-b ${borderColor} last:border-b-0`}>
                    <div className={`w-10 h-10 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      {activity.user.charAt(0)}
                    </div>
                    <div className="ml-4 flex-1">
                      <p className={`text-sm font-medium ${textColor}`}>
                        {activity.user} <span className={textMutedColor}>{activity.action.toLowerCase()}</span> {activity.car}
                      </p>
                      <p className={`text-xs ${textMutedColor}`}>{activity.time}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      activity.action === 'Reserved' ? 'bg-green-100 text-green-800' :
                      activity.action === 'Returned' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {activity.action}
                    </span>
                  </div>
                ))
              ) : (
                <p className={textMutedColor}>No recent activity to display.</p>
              )}
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
