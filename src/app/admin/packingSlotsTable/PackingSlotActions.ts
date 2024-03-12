import supabase from "@/supabaseClient";
import { DatabaseError } from "@/app/errorClasses";
import { GridRowId } from "@mui/x-data-grid";
import { PackingSlotRow } from "@/app/admin/packingSlotsTable/PackingSlotsTable";

export interface DBPackingSlotData {
    primary_key?: string;
    name: string;
    is_shown: boolean;
    order: number;
}

export const fetchPackingSlots = async (): Promise<PackingSlotRow[]> => {
    const { data, error } = await supabase.from("packing_slots").select().order("order");
    if (error) {
        throw new DatabaseError("fetch", "packing slots");
    }

    const processedData = data.map((row): PackingSlotRow => {
        return {
            name: row.name,
            id: row.primary_key,
            isShown: row.is_shown,
            order: row.order,
            isNew: false,
        };
    });

    return processedData;
};

const getDbPackingSlotFromTableRow = (row: PackingSlotRow): DBPackingSlotData => {
    return {
        primary_key: row.id,
        name: row.name,
        is_shown: row.isShown,
        order: row.order,
    };
};

const processNewRowData = (newRow: PackingSlotRow): DBPackingSlotData => {
    return {
        name: newRow.name,
        is_shown: newRow.isShown,
        order: newRow.order,
    };
};

export const createPackingSlot = async (newRow: PackingSlotRow): Promise<void> => {
    const data = processNewRowData(newRow);
    const { error } = await supabase.from("packing_slots").insert(data);

    if (error) {
        throw new DatabaseError("insert", "packing slots");
    }
};

export const updatePackingSlot = async (row: PackingSlotRow): Promise<void> => {
    const processedData = getDbPackingSlotFromTableRow(row);
    const { error } = await supabase
        .from("packing_slots")
        .update(processedData)
        .eq("primary_key", processedData.primary_key);

    if (error) {
        throw new DatabaseError("update", "packing slots");
    }
};

export const deletePackingSlot = async (id: GridRowId): Promise<void> => {
    const { error } = await supabase.from("packing_slots").delete().eq("primary_key", id);

    if (error) {
        throw new DatabaseError("delete", "packing slots");
    }
};

export const swapRows = async (rowOne: PackingSlotRow, rowTwo: PackingSlotRow): Promise<void> => {
    const updatedRows = await swapRowTwoToRowOneOrder(rowOne, rowTwo);

    if (rowOne.order - rowTwo.order > 0) {
        await swapRowOneToRowTwoOrderUpClick(updatedRows);
    } else {
        await swapRowOneToRowTwoOrderDownClick(updatedRows);
    }
};

const swapRowTwoToRowOneOrder = async (
    rowOne: PackingSlotRow,
    rowTwo: PackingSlotRow
): Promise<DBPackingSlotData[]> => {
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

const swapRowOneToRowTwoOrderUpClick = async (updatedRows: DBPackingSlotData[]): Promise<void> => {
    const { error } = await supabase
        .from("packing_slots")
        .update({
            order: updatedRows[1].order - 1,
        })
        .eq("primary_key", updatedRows[0].primary_key);

    if (error) {
        throw new DatabaseError("update", "packing_slots");
    }
};

const swapRowOneToRowTwoOrderDownClick = async (
    updatedRows: DBPackingSlotData[]
): Promise<void> => {
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
