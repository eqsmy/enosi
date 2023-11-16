import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://usnnwgiufohluhxdtvys.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzbm53Z2l1Zm9obHVoeGR0dnlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk1NzAwNDMsImV4cCI6MjAxNTE0NjA0M30.6wDMe50FOXY2wsiNpdR0KlUqjoPrcuPUimmoQ3I8S58";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
