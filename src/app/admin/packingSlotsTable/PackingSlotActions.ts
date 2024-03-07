import supabase from "@/supabaseClient";
import { DatabaseError } from "@/app/errorClasses";

interface DBPackingSlotData {
    id: number;
    name: string;
    is_hidden: boolean;
    order: number;
}

export const createPackingSlot = async (tableData: DBPackingSlotData): Promise<void> => {
    const { error } = await supabase.from("packing_slots").insert(tableData);

    if (error) {
        throw new DatabaseError("insert", "packing slots");
    }
};

export const updatePackingSlot = async (tableData: DBPackingSlotData): Promise<void> => {
    const { error } = await supabase.from("packing_slots").update(tableData).eq("id", tableData.id);

    if (error) {
        throw new DatabaseError("update", "packing slots");
    }
};
