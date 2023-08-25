import { ClientsTableRow } from "@/app/clients/ClientsPage";
import supabase from "@/supabaseServer";
import { familyCountToFamilyCategory } from "@/app/parcels/getExpandedParcelDetails";
import { DatabaseError } from "@/app/errorClasses";

const getClientsData = async (): Promise<ClientsTableRow[]> => {
    const data: ClientsTableRow[] = [];

    const { data: clients, error: clientError } = await supabase
        .from("clients")
        .select("primary_key, full_name, family_id, address_postcode");

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
            primaryKey: client.primary_key,
            fullName: client.full_name,
            familyCategory: familyCountToFamilyCategory(count),
            addressPostcode: client.address_postcode,
        });
    }

    return data;
};

export default getClientsData;
