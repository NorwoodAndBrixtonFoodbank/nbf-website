import supabase from "@/supabaseClient";
import { DatabaseError } from "@/app/errorClasses";
import { GridRowId } from "@mui/x-data-grid";

export interface DBPackingSlotData {
    primary_key?: string;
    name: string;
    is_hidden: boolean;
    order: number;
}

export interface DataGridPackingSlotRow {
    id: string;
    name: string;
    is_hidden: boolean;
    order: number;
}
interface packingSlotTableRowData extends DataGridPackingSlotRow {
    isNew: boolean;
}

const processRowData = (tableData: packingSlotTableRowData): DBPackingSlotData => {
    const data = { ...tableData };
    const newData: DBPackingSlotData = {
        primary_key: data.id,
        name: data.name,
        is_hidden: data.is_hidden,
        order: data.order,
    };
    return newData;
};

const processNewRowData = (tableData: packingSlotTableRowData): DBPackingSlotData => {
    const data = { ...tableData };
    const newData: DBPackingSlotData = {
        name: data.name,
        is_hidden: data.is_hidden,
        order: data.order,
    };
    return newData;
};

export const createPackingSlot = async (tableData: packingSlotTableRowData): Promise<void> => {
    console.log("creating");
    const data = processNewRowData(tableData);
    const { error } = await supabase.from("packing_slots").insert(data);

    if (error) {
        throw new DatabaseError("insert", "packing slots");
    }
};

export const updatePackingSlot = async (tableData: packingSlotTableRowData): Promise<void> => {
    console.log("updating");
    const processedData = processRowData(tableData);
    const { error } = await supabase
        .from("packing_slots")
        .update(processedData)
        .eq("primary_key", processedData.primary_key);

    if (error) {
        throw new DatabaseError("update", "packing slots");
    }
};

export const deletePackingSlot = async (id: GridRowId): Promise<void> => {
    console.log("deleting");
    const { error } = await supabase.from("packing_slots").delete().eq("primary_key", id);

    if (error) {
        throw new DatabaseError("delete", "packing slots");
    }
};

export const swapRows = async (
    row1: packingSlotTableRowData,
    row2: packingSlotTableRowData
): Promise<void> => {
    const { error } = await supabase.from("packing_slots").upsert(
        [
            {
                primary_key: row1.id,
                order: row2.order,
                name: row1.name,
                is_hidden: row1.is_hidden,
            },
            {
                primary_key: row2.id,
                order: row1.order,
                name: row2.name,
                is_hidden: row2.is_hidden,
            },
        ],
        { onConflict: "ignoreDuplicates" }
    );

    if (error) {
        throw new DatabaseError("update", "packing_slots");
    }

    const temp = row1.order;
    row1.order = row2.order;
    row2.order = temp;
};
