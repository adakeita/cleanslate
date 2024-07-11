import { createClient } from "@supabase/supabase-js";

let supabaseUrl = "https://cdcupzgpeavpzmidddbj.supabase.co";
let supabaseAnonKey;

if (typeof window === "undefined") {
    // Server-side: Use Node.js environment variable
    supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
} else {
    // Client-side: Use Vite's environment variable
    supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
