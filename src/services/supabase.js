import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  'https://xovcthkeiwprfmqggtid.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvdmN0aGtlaXdwcmZtcWdndGlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA5OTE1ODUsImV4cCI6MjEwNjU2NzU4NX0.M7fDaGWxWZJPCa4h6eakY27DkzXYek0-I4kkanGQ80w';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
