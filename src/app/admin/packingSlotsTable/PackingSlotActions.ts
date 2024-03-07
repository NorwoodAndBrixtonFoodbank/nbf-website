import supabase from "@/supabaseClient";
import { DatabaseError } from "@/app/errorClasses";
import { GridRowId } from "@mui/x-data-grid";

export interface DBPackingSlotData {
    id: number;
    name: string;
    is_hidden: boolean;
    order: number;
}

interface packingSlotTableRowData extends DBPackingSlotData {
    isNew: boolean;
}

const processRowData = (tableData: packingSlotTableRowData): DBPackingSlotData => {
    const data = { ...tableData };
    const newData: DBPackingSlotData = {
        id: data.id,
        name: data.name,
        is_hidden: data.is_hidden,
        order: data.order,
    };
    return newData;
};

export const createPackingSlot = async (tableData: packingSlotTableRowData): Promise<void> => {
    console.log("creating");
    const data = processRowData(tableData);
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
        .eq("id", processedData.id);

    if (error) {
        throw new DatabaseError("update", "packing slots");
    }
};

export const deletePackingSlot = async (id: GridRowId): Promise<void> => {
    console.log("deleting");
    const { error } = await supabase.from("packing_slots").delete().eq("id", id);

    if (error) {
        throw new DatabaseError("update", "packing slots");
    }
};
