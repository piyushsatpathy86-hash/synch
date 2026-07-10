import { createClient } from "@supabase/supabase-js";

// These come from .env (local) or Vercel env vars (production).
// Never hardcode the real values here — see .env.example
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
