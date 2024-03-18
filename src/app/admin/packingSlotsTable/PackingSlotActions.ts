import supabase from "@/supabaseClient";
import { DatabaseError } from "@/app/errorClasses";
import { PackingSlotRow } from "@/app/admin/packingSlotsTable/PackingSlotsTable";
import { Tables } from "@/databaseTypesFile";
import { logError } from "@/logger/logger";

type DbPackingSlot = Tables<"packing_slots">;
type NewDbPackingSlot = Omit<DbPackingSlot, "primary_key">;

export const fetchPackingSlots = async (): Promise<PackingSlotRow[]> => {
    const { data, error } = await supabase.from("packing_slots").select().order("order");
    if (error) {
        throw new DatabaseError("fetch", "packing slots");
    }

    return data.map(
        (row): PackingSlotRow => ({
            name: row.name,
            id: row.primary_key,
            isShown: row.is_shown,
            order: row.order,
            isNew: false,
        })
    );
};

const formatExistingRowToDBPackingSlot = (row: PackingSlotRow): DbPackingSlot => {
    return {
        primary_key: row.id,
        name: row.name,
        is_shown: row.isShown,
        order: row.order,
    };
};

const formatNewRowToDBPackingSlot = (newRow: PackingSlotRow): NewDbPackingSlot => {
    return {
        name: newRow.name,
        is_shown: newRow.isShown,
        order: newRow.order,
    };
};

export const insertNewPackingSlot = async (newRow: PackingSlotRow): Promise<void> => {
    const data = formatNewRowToDBPackingSlot(newRow);
    const { error } = await supabase.from("packing_slots").insert(data);

    if (error) {
        throw new DatabaseError("insert", "packing slots");
    }
};

export const updateDbPackingSlot = async (row: PackingSlotRow): Promise<void> => {
    const processedData = formatExistingRowToDBPackingSlot(row);
    const { error } = await supabase
        .from("packing_slots")
        .update(processedData)
        .eq("primary_key", processedData.primary_key);

    if (error) {
        throw new DatabaseError("update", "packing slots");
    }
};

export const swapRows = async (row1: PackingSlotRow, row2: PackingSlotRow): Promise<void> => {
    const { error } = await supabase.rpc("packing_slot_order_swap", {
        id1: row1.id,
        id2: row2.id,
    });
    if (error) {
        void logError("Error with update: packing slots order", error);
        throw new DatabaseError("update", "packing slots order");
    }
};
