
import { supabase } from "@/integrations/supabase/client";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  createdAt: string;
  reservations: Reservation[];
}

export interface Reservation {
  id: string;
  carId: string;
  carName: string;
  carImage: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  firstConfirmation: boolean;
  secondConfirmation: boolean;
}

export const fetchUsers = async (): Promise<User[]> => {
  try {
    // Fetch reservations data
    const { data: reservationsData, error: reservationsError } = await supabase
      .from('reservations')
      .select(`
        id,
        car_id,
        first_name,
        last_name,
        phone,
        city,
        pickup_date,
        return_date,
        status,
        first_confirmation,
        second_confirmation,
        created_at,
        cars (name, image)
      `)
      .order('created_at', { ascending: false });

    if (reservationsError) throw reservationsError;
    if (!reservationsData) return [];

    // Group reservations by user
    const usersMap = new Map<string, User>();

    reservationsData.forEach((reservation) => {
      const userKey = `${reservation.first_name}-${reservation.last_name}-${reservation.phone}`;
      
      // Ensure status is one of the allowed values, defaulting to 'pending' if invalid
      const validStatus = (reservation.status === 'pending' || 
                          reservation.status === 'confirmed' || 
                          reservation.status === 'completed' || 
                          reservation.status === 'cancelled') 
                          ? reservation.status as 'pending' | 'confirmed' | 'completed' | 'cancelled'
                          : 'pending';
      
      const reservationObj: Reservation = {
        id: reservation.id,
        carId: reservation.car_id,
        carName: reservation.cars?.name || 'Unknown Car',
        carImage: reservation.cars?.image || 'https://via.placeholder.com/150',
        startDate: reservation.pickup_date.split('T')[0],
        endDate: reservation.return_date.split('T')[0],
        status: validStatus,
        firstConfirmation: Boolean(reservation.first_confirmation),
        secondConfirmation: Boolean(reservation.second_confirmation)
      };

      if (usersMap.has(userKey)) {
        // User exists, add this reservation
        const user = usersMap.get(userKey)!;
        user.reservations.push(reservationObj);
      } else {
        // Create new user
        usersMap.set(userKey, {
          id: reservation.id, // Using reservation ID as a unique identifier
          firstName: reservation.first_name,
          lastName: reservation.last_name,
          phone: reservation.phone,
          city: reservation.city,
          createdAt: reservation.created_at,
          reservations: [reservationObj]
        });
      }
    });

    return Array.from(usersMap.values());
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const updateReservationStatus = async (
  reservationId: string, 
  updates: { 
    status?: 'pending' | 'confirmed' | 'completed' | 'cancelled',
    first_confirmation?: boolean,
    second_confirmation?: boolean
  }
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('reservations')
      .update(updates)
      .eq('id', reservationId);
      
    if (error) throw error;
    
    // If both confirmations are set to true, update the car status to "reserved"
    if (updates.first_confirmation && updates.second_confirmation) {
      // First, get the car_id from the reservation
      const { data: reservationData, error: reservationError } = await supabase
        .from('reservations')
        .select('car_id')
        .eq('id', reservationId)
        .single();
        
      if (reservationError) throw reservationError;
      
      // Update the car status to "reserved"
      if (reservationData?.car_id) {
        const { error: carUpdateError } = await supabase
          .from('cars')
          .update({ status: 'reserved' })
          .eq('id', reservationData.car_id);
          
        if (carUpdateError) throw carUpdateError;
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error updating reservation:", error);
    return false;
  }
};
