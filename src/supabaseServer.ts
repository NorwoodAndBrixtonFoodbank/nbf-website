import { Database } from "@/databaseTypesFile";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { SupabaseClient } from "@supabase/supabase-js";

export function getSupabaseServerComponentClient(): SupabaseClient<Database> {
    return createServerComponentClient<Database>({ cookies });
}
