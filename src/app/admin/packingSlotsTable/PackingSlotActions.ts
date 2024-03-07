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