import supabase from "@/supabaseClient";
import { fetchClients, fetchFamilies } from "@/common/fetch";
import {
    ClientSummary,
    prepareClientSummary,
    prepareRequirementSummary,
    RequirementSummary,
} from "@/common/formatClientsData";
import { HouseholdSummary, prepareHouseholdSummary } from "@/common/formatFamiliesData";

export type ClientData = ClientSummary & HouseholdSummary & RequirementSummary;

const getClientData = async (clientID: string): Promise<ClientData> => {
    const clientData = await fetchClients(clientID, supabase);
    const familyData = await fetchFamilies(clientData.family_id, supabase);

    return {
        ...prepareClientSummary(clientData),
        ...prepareRequirementSummary(clientData),
        ...prepareHouseholdSummary(familyData),
    };
};

export default getClientData;
