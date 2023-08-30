import { Database } from "@/databaseTypesFile";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient<Database>();

export default supabase;
