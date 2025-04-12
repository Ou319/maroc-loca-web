
import { supabase } from "@/integrations/supabase/client";

export interface DashboardStats {
  totalCars: number;
  availableCars: number;
  totalUsers: number;
  activeReservations: number;
  totalReservations: number;
  revenue: number;
  revenueChange: number;
  carsChange: number;
  usersChange: number;
  reservationsChange: number;
}

export interface ReservationData {
  month: string;
  reservations: number;
}

export interface CarCategoryData {
  name: string;
  value: number;
}

export interface RecentActivity {
  id: string;
  user: string;
  action: string;
  car: string;
  time: string;
}

export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  try {
    // Get total cars and available cars
    const { data: carsData, error: carsError } = await supabase
      .from('cars')
      .select('id, status');
    
    if (carsError) throw carsError;
    
    const totalCars = carsData.length;
    const availableCars = carsData.filter(car => car.status === 'available').length;
    
    // Get total reservations and active reservations
    const { data: reservationsData, error: reservationsError } = await supabase
      .from('reservations')
      .select('id, status, pickup_date, return_date');
    
    if (reservationsError) throw reservationsError;
    
    const totalReservations = reservationsData.length;
    const now = new Date();
    const activeReservations = reservationsData.filter(res => {
      const pickupDate = new Date(res.pickup_date);
      const returnDate = new Date(res.return_date);
      return pickupDate <= now && returnDate >= now && res.status === 'confirmed';
    }).length;
    
    // Calculate estimated revenue (using a simple calculation for demo purposes)
    let revenue = 0;
    if (reservationsData.length > 0) {
      const { data: revenueCars, error: revenueError } = await supabase
        .from('cars')
        .select('id, price')
        .in('id', reservationsData.map(r => r.id));
      
      if (!revenueError && revenueCars) {
        revenue = reservationsData.reduce((acc, res) => {
          const car = revenueCars.find(c => c.id === res.id);
          if (car) {
            const pickupDate = new Date(res.pickup_date);
            const returnDate = new Date(res.return_date);
            const days = Math.max(1, Math.round((returnDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24)));
            return acc + (car.price * days);
          }
          return acc;
        }, 0);
      }
    }
    
    // For the changes, we would normally compare with last month
    // Here we're using dummy values for demonstration
    return {
      totalCars,
      availableCars,
      totalUsers: 0, // We don't have a users table yet
      activeReservations,
      totalReservations,
      revenue,
      revenueChange: -3,
      carsChange: 5,
      usersChange: 8,
      reservationsChange: 12
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
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
    };
  }
};

export const fetchReservationsByMonth = async (): Promise<ReservationData[]> => {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('created_at');
    
    if (error) throw error;
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize counts for all months
    const reservationsByMonth: { [key: string]: number } = {};
    monthNames.forEach(month => {
      reservationsByMonth[month] = 0;
    });
    
    // Count reservations by month
    data.forEach(reservation => {
      const date = new Date(reservation.created_at);
      const month = monthNames[date.getMonth()];
      reservationsByMonth[month]++;
    });
    
    // Convert to array format for the chart
    return monthNames.map(month => ({
      month,
      reservations: reservationsByMonth[month]
    }));
  } catch (error) {
    console.error("Error fetching reservations by month:", error);
    return [];
  }
};

export const fetchCarCategories = async (): Promise<CarCategoryData[]> => {
  try {
    const { data, error } = await supabase
      .from('cars')
      .select('category');
    
    if (error) throw error;
    
    const categories: { [key: string]: number } = {};
    
    // Count cars by category
    data.forEach(car => {
      if (!categories[car.category]) {
        categories[car.category] = 0;
      }
      categories[car.category]++;
    });
    
    // Convert to array format for the chart
    return Object.keys(categories).map(name => ({
      name,
      value: categories[name]
    }));
  } catch (error) {
    console.error("Error fetching car categories:", error);
    return [];
  }
};

export const fetchRecentActivity = async (): Promise<RecentActivity[]> => {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .select(`
        id, 
        first_name, 
        last_name, 
        status, 
        created_at,
        car_id
      `)
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (error) throw error;
    
    // Get car information
    const carIds = data.map(res => res.car_id);
    const { data: carsData, error: carsError } = await supabase
      .from('cars')
      .select('id, name')
      .in('id', carIds);
    
    if (carsError) throw carsError;
    
    return data.map(reservation => {
      const car = carsData.find(c => c.id === reservation.car_id);
      const user = `${reservation.first_name} ${reservation.last_name}`;
      let action = 'Reserved';
      
      if (reservation.status === 'cancelled') {
        action = 'Cancelled';
      } else if (reservation.status === 'completed') {
        action = 'Returned';
      }
      
      // Calculate time difference
      const reservationTime = new Date(reservation.created_at);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - reservationTime.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      
      let timeString = '';
      if (diffDays > 0) {
        timeString = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      } else {
        timeString = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      }
      
      return {
        id: reservation.id,
        user,
        action,
        car: car ? car.name : 'Unknown Car',
        time: timeString
      };
    });
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    return [];
  }
};
