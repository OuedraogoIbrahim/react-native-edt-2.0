import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://lycnirzfthhbtsztwkcy.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5Y25pcnpmdGhoYnRzenR3a2N5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2MTA1NDMsImV4cCI6MjA1OTE4NjU0M30.Ma_In7Uo3-8xAGr4yxPgFascTMepaKmqyH2swjCzyMI";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
