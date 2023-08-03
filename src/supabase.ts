import { Database } from "@/database_types_file";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
        auth: {
            persistSession: false,
        },
    }
);

export type DatabaseAutoType = Database;

type Tables = Database["public"]["Tables"];

export type Schema = {
    clients: Tables["clients"]["Row"];
    families: Tables["families"]["Row"];
    parcels: Tables["parcels"]["Row"];
    lists: Tables["lists"]["Row"];
};

export type InsertSchema = {
    clients: Tables["clients"]["Insert"];
    families: Tables["families"]["Insert"];
    parcels: Tables["parcels"]["Insert"];
    lists: Tables["lists"]["Insert"];
};

export default supabase;
