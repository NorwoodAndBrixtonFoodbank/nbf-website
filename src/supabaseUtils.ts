import { Database } from "@/databaseTypesFile";
import { SupabaseClient } from "@supabase/supabase-js";

export type Supabase = SupabaseClient<Database>;
