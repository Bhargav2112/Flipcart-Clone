import axios from 'axios';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

// Map API methods previously returning axios promises to supabase
const createEntityAdapter = (tableName) => ({
  filter: async (criteria = {}, orderBy = null, limit = null) => {
    let query = supabase.from(tableName).select('*');
    for (const [key, value] of Object.entries(criteria)) {
      query = query.eq(key, value);
    }
    if (orderBy) {
      const isDesc = orderBy.startsWith('-');
      const column = isDesc ? orderBy.substring(1) : orderBy;
      query = query.order(column, { ascending: !isDesc });
    }
    if (limit) {
      query = query.limit(limit);
    }
    const { data, error } = await query;
    if (error) {
      console.error(`[Supabase Error in ${tableName}]:`, error);
      toast.error(`DB Error: ${error.message}`);
      throw error;
    }
    return data;
  },
  create: async (dataToInsert) => {
    const { data, error } = await supabase.from(tableName).insert([dataToInsert]).select();
    if (error) throw error;
    return data[0];
  },
  update: async (id, dataToUpdate) => {
    const { data, error } = await supabase.from(tableName).update(dataToUpdate).eq('id', id).select();
    if (error) throw error;
    return data[0];
  },
  delete: async (id) => {
    const { error } = await supabase.from(tableName).delete().eq('id', id);
    if (error) throw error;
    return true;
  },
});

export const base44 = {
  auth: {
    isAuthenticated: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return !!session;
    },
    me: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      // Emulating the previous return structure where user had a direct email mapping
      return user ? { email: user.email, ...user.user_metadata } : null;
    },
    login: async (credentials) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });
      if (error) throw error;
      return data;
    },
    register: async (userData) => {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            role: 'customer'
          }
        }
      });
      if (error) throw error;
      return data;
    },
    logout: async () => {
      await supabase.auth.signOut();
      window.location.href = '/login';
    },
    redirectToLogin: () => {
      window.location.href = '/login';
    }
  },
  entities: {
    Product: createEntityAdapter('Product'),
    WishlistItem: createEntityAdapter('WishlistItem'),
    CartItem: createEntityAdapter('CartItem'),
    Order: createEntityAdapter('Order'),
    OrderItem: createEntityAdapter('OrderItem'),
    Coupon: createEntityAdapter('Coupon'),
    Category: createEntityAdapter('Category'),
    Address: createEntityAdapter('Address'),
    User: createEntityAdapter('User'),
  },
};

// Also mock axiosInstance just in case but it shouldn't be relied upon.
export const axiosInstance = axios.create();
export default axiosInstance;
