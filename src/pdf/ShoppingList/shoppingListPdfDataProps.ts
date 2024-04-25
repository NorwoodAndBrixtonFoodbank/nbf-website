import { ParcelInfo } from "@/pdf/ShoppingList/getParcelsData";
import { ClientSummary, RequirementSummary } from "@/common/formatClientsData";
import { HouseholdSummary } from "@/common/formatFamiliesData";
import { FetchListsError, fetchLists } from "@/common/fetch";
import supabase from "@/supabaseClient";
import { Schema } from "@/databaseUtils";

export interface Item {
    description: string;
    quantity: string;
    notes: string;
}

export interface ShoppingListPdfData {
    postcode: string;
    parcelInfo: ParcelInfo;
    clientSummary: ClientSummary;
    householdSummary: HouseholdSummary;
    requirementSummary: RequirementSummary;
    itemsList: Item[];
    endNotes: string;
}

type PrepareItemsListResponse =
    | {
          data: Item[];
          error: null;
      }
    | {
          data: null;
          error: PrepareItemsListError;
      };

type PrepareItemsListError = FetchListsError;

const getQuantityAndNotes = (
    row: Schema["lists"],
    size: number
): Pick<Item, "quantity" | "notes"> => {
    if (size >= 10) {
        size = 10;
    }
    const sizeQuantity = `quantity_for_${size}` as keyof Schema["lists"];
    const sizeNotes = `notes_for_${size}` as keyof Schema["lists"];
    return {
        quantity: row[sizeQuantity]?.toString() ?? "",
        notes: row[sizeNotes]?.toString() ?? "",
    };
};

export const prepareItemsListForHousehold = async (
    householdSize: number
): Promise<PrepareItemsListResponse> => {
    const { data: listData, error } = await fetchLists(supabase);
    if (error) {
        return { data: null, error: error };
    }
    const itemsList = listData.map((row): Item => {
        return {
            description: row.item_name,
            ...getQuantityAndNotes(row, householdSize),
        };
    });
    return { data: itemsList, error: null };
};
