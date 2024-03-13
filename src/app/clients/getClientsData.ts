import { ClientsTableRow } from "@/app/clients/ClientsPage";
import { familyCountToFamilyCategory } from "@/app/parcels/getExpandedParcelDetails";
import { DatabaseError } from "@/app/errorClasses";
import { Supabase } from "@/supabaseUtils";
import { logError } from "@/logger/logger";
import { v4 as uuidv4 } from "uuid";
const getClientsData = async (supabase: Supabase): Promise<ClientsTableRow[]> => {
    const data: ClientsTableRow[] = [];

    const { data: clients, error: clientError } = await supabase
        .from("clients")
        .select("primary_key, full_name, family_id, address_postcode")
        .order("full_name");

    if (clientError) {
        const id = uuidv4();
        const meta = {
            error: clientError,
            id: id,
            location: "app/clients/getClientsData.ts",
        };
        void logError("Error fetching clients", meta);
        throw new DatabaseError("fetch", "clients");
    }

    for (const client of clients) {
        const { count, error: familyError } = await supabase
            .from("families")
            .select("*", { count: "exact", head: true })
            .eq("family_id", client.family_id);

        if (familyError || count === null) {
            const id = uuidv4();
            const meta = {
                error: familyError,
                id: id,
                location: "app/clients/getClientsData.ts",
            };
            void logError("Error fetching families", meta);
            throw new DatabaseError("fetch", "families");
        }

        data.push({
            clientId: client.primary_key,
            fullName: client.full_name,
            familyCategory: familyCountToFamilyCategory(count),
            addressPostcode: client.address_postcode,
        });
    }

    return data;
};

export default getClientsData;
