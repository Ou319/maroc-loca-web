
import { supabase } from "@/integrations/supabase/client";

export interface AdminUser {
  id: string;
  username: string;
  created_at: string;
}

export const fetchAdmins = async (): Promise<AdminUser[]> => {
  const { data, error } = await supabase
    .from('admin_users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const createAdmin = async ({ 
  username, 
  password 
}: { 
  username: string; 
  password: string;
}): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('admin_users')
      .insert([{ username, password }]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error creating admin:', error);
    return false;
  }
};

export const deleteAdmin = async (adminId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('admin_users')
      .delete()
      .eq('id', adminId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting admin:', error);
    return false;
  }
};
