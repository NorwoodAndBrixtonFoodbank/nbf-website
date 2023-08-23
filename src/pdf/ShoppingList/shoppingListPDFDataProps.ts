import { ParcelInfo } from "@/pdf/ShoppingList/getParcelsData";
import { ClientSummary, RequirementSummary } from "@/common/formatClientsData";
import { HouseholdSummary } from "@/common/formatFamiliesData";
import { fetchLists } from "@/common/fetch";
import supabase from "@/supabaseClient";
import { Schema } from "@/database_utils";

export interface Item {
    description: string;
    quantity: string;
    notes: string;
}

export interface ShoppingListPDFDataProps {
    postcode: string;
    parcelInfo: ParcelInfo;
    clientSummary: ClientSummary;
    householdSummary: HouseholdSummary;
    requirementSummary: RequirementSummary;
    itemsList: Item[];
    endNotes: string;
}

const getQuantityAndNotes = (
    row: Schema["lists"],
    size: number
): Pick<Item, "quantity" | "notes"> => {
    if (size >= 10) {
        size = 10;
    }
    const size_quantity = `${size}_quantity` as keyof Schema["lists"];
    const size_notes = `${size}_notes` as keyof Schema["lists"];
    return {
        quantity: row[size_quantity]?.toString() ?? "",
        notes: row[size_notes]?.toString() ?? "",
    };
};

export const prepareItemsList = async (householdSize: number): Promise<Item[]> => {
    const listData = await fetchLists(supabase);
    return listData.map((row): Item => {
        return {
            description: row.item_name,
            ...getQuantityAndNotes(row, householdSize),
        };
    });
};
