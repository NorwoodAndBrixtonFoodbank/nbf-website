import { ParcelInfo } from "@/pdf/ShoppingList/getParcelsData";
import { ClientSummary, RequirementSummary } from "@/common/formatClientsData";
import { HouseholdSummary } from "@/common/formatFamiliesData";
import { fetchLists } from "@/common/fetch";
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

export interface ShoppingListPdfDataList {
    lists: ShoppingListPdfData[];
}

const getQuantityAndNotes = (
    row: Schema["lists"],
    size: number
): Pick<Item, "quantity" | "notes"> => {
    if (size >= 10) {
        size = 10;
    }
    const sizeQuantity = `${size}_quantity` as keyof Schema["lists"];
    const sizeNotes = `${size}_notes` as keyof Schema["lists"];
    return {
        quantity: row[sizeQuantity]?.toString() ?? "",
        notes: row[sizeNotes]?.toString() ?? "",
    };
};

export const prepareItemsListForHousehold = async (householdSize: number): Promise<Item[]> => {
    const listData = await fetchLists(supabase);
    return listData.map((row): Item => {
        return {
            description: row.item_name,
            ...getQuantityAndNotes(row, householdSize),
        };
    });
};
