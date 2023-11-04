import { Schema } from "@/databaseUtils";
import supabase from "@/supabaseClient";
import { fetchClient, fetchComment, fetchFamily } from "@/common/fetch";
import {
    prepareClientSummary,
    prepareRequirementSummary,
    processExtraInformation,
} from "@/common/formatClientsData";
import { prepareHouseholdSummary } from "@/common/formatFamiliesData";
import { prepareParcelInfo } from "@/pdf/ShoppingList/getParcelsData";
import {
    prepareItemsListForHousehold,
    ShoppingListPdfData,
    ShoppingListPdfDataList,
} from "@/pdf/ShoppingList/shoppingListPdfDataProps";

interface ClientDataAndFamilyData {
    clientData: Schema["clients"];
    familyData: Schema["families"][];
}

const getClientAndFamilyData = async (clientID: string): Promise<ClientDataAndFamilyData> => {
    const clientData = await fetchClient(clientID, supabase);
    const familyData = await fetchFamily(clientData.family_id, supabase);

    return { clientData: clientData, familyData: familyData };
};

const getShoppingListDataForSingleParcel = async (
    parcelId: string
): Promise<ShoppingListPdfData> => {
    const { parcelInfo, clientID: clientId } = await prepareParcelInfo(parcelId);
    const { clientData, familyData } = await getClientAndFamilyData(clientId);
    const itemsList = await prepareItemsListForHousehold(familyData.length);

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

const getShoppingListData = async (parcelIds: string[]): Promise<ShoppingListPdfDataList> => {
    return {
        lists: await Promise.all(
            parcelIds.map(async (parcelId: string) => {
                return await getShoppingListDataForSingleParcel(parcelId);
            })
        ),
    };
};

export default getShoppingListData;
