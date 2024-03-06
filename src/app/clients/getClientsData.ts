import { ClientsTableRow } from "@/app/clients/ClientsPage";
import { familyCountToFamilyCategory } from "@/app/parcels/getExpandedParcelDetails";
import { DatabaseError } from "@/app/errorClasses";
import { Supabase } from "@/supabaseUtils";
import { cl } from "@fullcalendar/core/internal-common";
import { Filter } from "@/components/Tables/Filters";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import { Database, Tables } from "@/databaseTypesFile";
import { Schema, } from "@/databaseUtils";
import { GenericSchema } from "@supabase/postgrest-js/dist/module/types";

const getClientsData = async (supabase: Supabase, start: number, end: number, filters: Filter<ClientsTableRow, any>[], perPage: number): Promise<ClientsTableRow[]> => {
    const data: ClientsTableRow[] = [];

    let query = supabase
        .from("clients")
        .select("primary_key, full_name, family_id, address_postcode", {count: 'exact'})
        .order("full_name");

    filters.forEach((filter) => {
        query = filter.filterMethod(query, filter.state);
    })

    query = query.range(start, end); //fix
    
    const { data: clients, count: number, error: clientError } = await query

    if (clientError) {
        throw new DatabaseError("fetch", "clients");
    }

    for (const client of clients) {
        const { count, error: familyError } = await supabase
            .from("families")
            .select("*", { count: "exact", head: true })
            .eq("family_id", client.family_id);

        if (familyError || count === null) {
            throw new DatabaseError("fetch", "families");
        }

        data.push({
            clientId: client.primary_key,
            fullName: client.full_name,
            familyCategory: familyCountToFamilyCategory(count),
            addressPostcode: client.address_postcode,
        });
    }

    return data; //return filtered count somewhere
};

// export const getClientsDataFilteredByName = async (supabase: Supabase, limit: number, name: string): Promise<ClientsTableRow[]> => {
//     const data: ClientsTableRow[] = [];
//     console.log("searching ",name);

//     const { data: clients, error: clientError } = await supabase
//         .from("clients")
//         .select("primary_key, full_name, family_id, address_postcode")
//         .ilike('full_name', `%${name}%`)
//         .limit(limit)
//         .order("full_name");

//     if (clientError) {
//         throw new DatabaseError("fetch", "clients");
//     }

//     for (const client of clients) {
//         const { count, error: familyError } = await supabase
//             .from("families")
//             .select("*", { count: "exact", head: true })
//             .eq("family_id", client.family_id);

//         if (familyError || count === null) {
//             throw new DatabaseError("fetch", "families");
//         }

//         data.push({
//             clientId: client.primary_key,
//             fullName: client.full_name,
//             familyCategory: familyCountToFamilyCategory(count),
//             addressPostcode: client.address_postcode,
//         });
//     }

//     return data;
// };

export const getClientsCount = async (supabase: Supabase): Promise<number> => {
    const { count, error: clientError } = await supabase
  .from('clients')
  .select('*', { count: 'exact', head: true });
  
  if (clientError || count === null) {
    throw new DatabaseError("fetch", "clients");

  }
  return count;
}

export default getClientsData;
