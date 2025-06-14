import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANOM_KEY;

const api = createClient(supabaseUrl, supabaseAnonKey);

export default api;
