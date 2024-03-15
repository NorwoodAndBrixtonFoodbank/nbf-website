import { ClientsTableRow } from "@/app/clients/ClientsPage";
import { familyCountToFamilyCategory } from "@/app/parcels/getExpandedParcelDetails";
import { DatabaseError } from "@/app/errorClasses";
import { Supabase } from "@/supabaseUtils";
import { logError } from "@/logger/logger";

const getClientsData = async (supabase: Supabase): Promise<ClientsTableRow[]> => {
    const data: ClientsTableRow[] = [];

    const { data: clients, error: clientError } = await supabase
        .from("clients")
        .select("primary_key, full_name, family_id, address_postcode")
        .order("full_name");

    if (clientError) {
        const response = logError("Error with fetch: Clients", clientError);
        response.then((errorId) => {
            throw new DatabaseError("fetch", "clients", errorId);
        });
    }

    if (clients) {
        for (const client of clients) {
            const { count, error: familyError } = await supabase
                .from("families")
                .select("*", { count: "exact", head: true })
                .eq("family_id", client.family_id);

            if (familyError || count === null) {
                const response = logError("Error with fetch: Client families", familyError);
                response.then((errorId) => {
                    throw new DatabaseError("fetch", "client families", errorId);
                });
            } else {
                data.push({
                    clientId: client.primary_key,
                    fullName: client.full_name,
                    familyCategory: familyCountToFamilyCategory(count),
                    addressPostcode: client.address_postcode,
                });
            }
        }
    }

    return data;
};

export default getClientsData;
