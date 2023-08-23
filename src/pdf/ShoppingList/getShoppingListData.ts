import { Schema } from "@/database_utils";
import supabase from "@/supabaseClient";
import { fetchClients, fetchComment, fetchFamilies } from "@/common/fetch";
import {
    prepareClientSummary,
    prepareRequirementSummary,
    processExtraInformation,
} from "@/common/formatClientsData";
import { prepareHouseholdSummary } from "@/common/formatFamiliesData";
import { prepareParcelInfo } from "@/pdf/ShoppingList/getParcelsData";
import {
    prepareItemsList,
    ShoppingListPDFDataProps,
} from "@/pdf/ShoppingList/shoppingListPDFDataProps";

interface ClientDataAndFamilyData {
    clientData: Schema["clients"];
    familyData: Schema["families"][];
}

const getClientAndFamilyData = async (clientID: string): Promise<ClientDataAndFamilyData> => {
    const clientData = await fetchClients(clientID, supabase);
    const familyData = await fetchFamilies(clientData.family_id, supabase);

    return { clientData: clientData, familyData: familyData };
};

const getShoppingListData = async (parcelID: string): Promise<ShoppingListPDFDataProps> => {
    const { parcelInfo, clientID } = await prepareParcelInfo(parcelID);
    const { clientData, familyData } = await getClientAndFamilyData(clientID);
    const itemsList = await prepareItemsList(familyData.length);

    const clientSummary = prepareClientSummary(clientData);
    const householdSummary = prepareHouseholdSummary(familyData);
    const requirementSummary = prepareRequirementSummary(clientData);

    const { nappySize } = processExtraInformation(clientData.extra_information);
    requirementSummary.babyProductsRequired += ` (${nappySize})`;

    const endNotes = await fetchComment(supabase);

    return {
        postcode: clientData.address_postcode,
        parcelInfo: parcelInfo,
        clientSummary: clientSummary,
        householdSummary: householdSummary,
        requirementSummary: requirementSummary,
        itemsList: itemsList,
        endNotes: endNotes,
    };
};

export default getShoppingListData;
