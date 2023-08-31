import supabaseClient from "@/supabaseClient";
import supabaseServer from "@/supabaseServer";

export type Supabase = typeof supabaseClient | typeof supabaseServer;
