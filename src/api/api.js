import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnomKey = process.env.REACT_APP_SUPABASE_ANOM_KEY;

const api = createClient(supabaseUrl, supabaseAnomKey);

export default api;