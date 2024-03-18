import { ClientsTableRow } from "@/app/clients/ClientsPage";
import { familyCountToFamilyCategory } from "@/app/parcels/getExpandedParcelDetails";
import { DatabaseError } from "@/app/errorClasses";
import { Supabase } from "@/supabaseUtils";
import { logErrorReturnLogId } from "@/logger/logger";

const getClientsData = async (supabase: Supabase): Promise<ClientsTableRow[]> => {
    const data: ClientsTableRow[] = [];

    const { data: clients, error: clientError } = await supabase
        .from("clients")
        .select("primary_key, full_name, family_id, address_postcode")
        .order("full_name");

    if (clientError) {
        const logId = await logErrorReturnLogId("Error with fetch: Clients", clientError);
        throw new DatabaseError("fetch", "clients", logId);
    }

    for (const client of clients) {
        const { count, error: familyError } = await supabase
            .from("families")
            .select("*", { count: "exact", head: true })
            .eq("family_id", client.family_id);

        if (familyError) {
            const logId = await logErrorReturnLogId("Error with fetch: Client family", familyError);
            throw new DatabaseError("fetch", "client family", logId);
        }

        if (count === null) {
            const logId = await logErrorReturnLogId(
                "Error with fetch: Client family count is null"
            );
            throw new DatabaseError("fetch", "client family count is null", logId);
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
