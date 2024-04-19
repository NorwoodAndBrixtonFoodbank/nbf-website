import { Schema } from "@/databaseUtils";
import supabase from "@/supabaseClient";
import {
    FetchClientErrorType,
    FetchFamilyErrorType,
    FetchListsCommentError,
    FetchListsCommentErrorType,
    FetchListsError,
    FetchListsErrorType,
    FetchParcelError,
    FetchParcelErrorType,
    fetchClient,
    fetchListsComment,
    fetchFamily,
} from "@/common/fetch";
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
} from "@/pdf/ShoppingList/shoppingListPdfDataProps";

interface ClientDataAndFamilyData {
    clientData: Schema["clients"];
    familyData: Schema["families"][];
}

type FetchShoppingListResponse =
    | {
          data: ClientDataAndFamilyData;
          error: null;
      }
    | {
          data: null;
          error: FetchShoppingListError;
      };

type FetchShoppingListErrorType = FetchClientErrorType | FetchFamilyErrorType;

interface FetchShoppingListError {
    type: FetchShoppingListErrorType;
    logId: string;
}

const getClientAndFamilyData = async (clientID: string): Promise<FetchShoppingListResponse> => {
    const { data: clientData, error: clientError } = await fetchClient(clientID, supabase);
    if (clientError) {
        return { data: null, error: clientError };
    }

    const { data: familyData, error: familyError } = await fetchFamily(
        clientData.family_id,
        supabase
    );
    if (familyError) {
        return { data: null, error: familyError };
    }

    return { data: { clientData: clientData, familyData: familyData }, error: null };
};

type FetchShoppingListForPdfResponse =
    | {
          data: ShoppingListPdfData;
          error: null;
      }
    | {
          data: null;
          error: ShoppingListPdfError;
      };

export type ShoppingListPdfError =
    | FetchShoppingListError
    | FetchListsError
    | FetchListsCommentError
    | FetchParcelError;
export type ShoppingListPdfErrorType =
    | FetchShoppingListErrorType
    | FetchListsErrorType
    | FetchListsCommentErrorType
    | FetchParcelErrorType;

const getShoppingListDataForSingleParcel = async (
    parcelId: string
): Promise<FetchShoppingListForPdfResponse> => {
    const { data: parcelInfoAndClientIdData, error: parcelInfoAndClientIdError } =
        await prepareParcelInfo(parcelId);
    if (parcelInfoAndClientIdError) {
        return { data: null, error: parcelInfoAndClientIdError };
    }

    const { data: clientAndFamilyData, error: clientAndFamilyError } = await getClientAndFamilyData(
        parcelInfoAndClientIdData.clientId
    );

    if (clientAndFamilyError) {
        return { data: null, error: clientAndFamilyError };
    }

    const familyData = clientAndFamilyData.familyData;
    const clientData = clientAndFamilyData.clientData;

    const { data: itemsListData, error: itemsListError } = await prepareItemsListForHousehold(
        familyData.length
    );
    if (itemsListError) {
        return { data: null, error: itemsListError };
    }

    const clientSummary = prepareClientSummary(clientData);
    const householdSummary = prepareHouseholdSummary(familyData);
    const requirementSummary = prepareRequirementSummary(clientData);

    const { nappySize } = processExtraInformation(clientData.extra_information);
    requirementSummary.babyProductsRequired += ` (${nappySize})`;

    const { data: endNotes, error: listsCommentError } = await fetchListsComment(supabase);
    if (listsCommentError) {
        return { data: null, error: listsCommentError };
    }

    const data = {
        postcode: clientData.address_postcode,
        parcelInfo: parcelInfoAndClientIdData.parcelInfo,
        clientSummary: clientSummary,
        householdSummary: householdSummary,
        requirementSummary: requirementSummary,
        itemsList: itemsListData,
        endNotes: endNotes,
    };
    return { data: data, error: null };
};

type ShoppingListPdfListResponse =
    | {
          data: ShoppingListPdfData[];
          error: null;
      }
    | {
          data: null;
          error: ShoppingListPdfError;
      };

const getShoppingListData = async (parcelIds: string[]): Promise<ShoppingListPdfListResponse> => {
    const lists = await Promise.all(
        parcelIds.map(async (parcelId: string) => {
            return await getShoppingListDataForSingleParcel(parcelId);
        })
    );
    if (lists.some((list) => list.error)) {
        return { data: null, error: lists.filter((list) => list.error)[0].error! };
    }
    return { data: lists.map((list) => list.data!), error: null };
};

export default getShoppingListData;
