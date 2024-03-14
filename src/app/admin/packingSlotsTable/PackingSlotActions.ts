import supabase from "@/supabaseClient";
import { DatabaseError } from "@/app/errorClasses";
import { GridRowId } from "@mui/x-data-grid";
import { PackingSlotRow } from "@/app/admin/packingSlotsTable/PackingSlotsTable";
import { Tables } from "@/databaseTypesFile";

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

export const dbPackingSlotToInsert = async (newRow: PackingSlotRow): Promise<void> => {
    const data = formatNewRowToDBPackingSlot(newRow);
    const { error } = await supabase.from("packing_slots").insert(data);

    if (error) {
        throw new DatabaseError("insert", "packing slots");
    }
};

export const dbPackingSlotToUpdate = async (row: PackingSlotRow): Promise<void> => {
    const processedData = formatExistingRowToDBPackingSlot(row);
    const { error } = await supabase
        .from("packing_slots")
        .update(processedData)
        .eq("primary_key", processedData.primary_key);

    if (error) {
        throw new DatabaseError("update", "packing slots");
    }
};

export const dbPackingSlotToDelete = async (id: GridRowId): Promise<void> => {
    const { error } = await supabase.from("packing_slots").delete().eq("primary_key", id);

    if (error) {
        throw new DatabaseError("delete", "packing slots");
    }
};

export const swapRows = async (rowOne: PackingSlotRow, rowTwo: PackingSlotRow): Promise<void> => {
    const updatedRowsAfterFirstSwap = await swapRowTwoToRowOneOrder(rowOne, rowTwo);

    if (rowOne.order - rowTwo.order > 0) {
        await swapRowOneToRowTwoOrderUpClick(updatedRowsAfterFirstSwap);
    } else {
        await swapRowOneToRowTwoOrderDownClick(updatedRowsAfterFirstSwap);
    }
};

const swapRowTwoToRowOneOrder = async (
    rowOne: PackingSlotRow,
    rowTwo: PackingSlotRow
): Promise<DbPackingSlot[]> => {
    const { data, error } = await supabase
        .from("packing_slots")
        .upsert([
            {
                primary_key: rowOne.id,
                order: -1,
                name: rowOne.name,
                is_shown: rowOne.isShown,
            },
            {
                primary_key: rowTwo.id,
                order: rowOne.order,
                name: rowTwo.name,
                is_shown: rowTwo.isShown,
            },
        ])
        .select();

    if (error) {
        throw new DatabaseError("update", "packing_slots");
    }

    return data;
};

const swapRowOneToRowTwoOrderUpClick = async (
    updatedRowsAfterFirstSwap: DbPackingSlot[]
): Promise<void> => {
    const { error } = await supabase
        .from("packing_slots")
        .update({
            order: updatedRowsAfterFirstSwap[1].order - 1,
        })
        .eq("primary_key", updatedRowsAfterFirstSwap[0].primary_key);

    if (error) {
        throw new DatabaseError("update", "packing_slots");
    }
};

const swapRowOneToRowTwoOrderDownClick = async (updatedRows: DbPackingSlot[]): Promise<void> => {
    const { error } = await supabase
        .from("packing_slots")
        .update({
            order: updatedRows[1].order + 1,
        })
        .eq("primary_key", updatedRows[0].primary_key);

    if (error) {
        throw new DatabaseError("update", "packing_slots");
    }
};
