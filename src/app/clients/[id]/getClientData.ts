import {
    ClientSummary,
    HouseholdSummary,
    prepareClientSummary,
    prepareHouseholdSummary,
    prepareRequirementSummary,
    RequirementSummary,
} from "@/pdf/ShoppingList/dataPreparation";
import { fetchClients, fetchFamilies } from "@/pdf/ShoppingList/databaseFetch";

export type ClientData = ClientSummary & HouseholdSummary & RequirementSummary;

const getClientData = async (clientID: string): Promise<ClientData> => {
    const clientData = await fetchClients(clientID);
    const familyData = await fetchFamilies(clientData.family_id);

    return {
        ...prepareClientSummary(clientData),
        ...prepareRequirementSummary(clientData),
        ...prepareHouseholdSummary(familyData),
    };
};

export default getClientData;
