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

export interface DataGridPackingSlotRow {
    id: string;
    name: string;
    is_shown: boolean;
    order: number;
}
interface packingSlotTableRowData extends DataGridPackingSlotRow {
    isNew: boolean;
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
            is_shown: row.is_shown,
            order: row.order,
            isNew: false,
        };
    });

    return processedData;
};

const processRowData = (tableData: packingSlotTableRowData): DBPackingSlotData => {
    const data = { ...tableData };
    const newData: DBPackingSlotData = {
        primary_key: data.id,
        name: data.name,
        is_shown: data.is_shown,
        order: data.order,
    };
    return newData;
};

const processNewRowData = (tableData: packingSlotTableRowData): DBPackingSlotData => {
    const data = { ...tableData };
    const newData: DBPackingSlotData = {
        name: data.name,
        is_shown: data.is_shown,
        order: data.order,
    };
    return newData;
};

export const createPackingSlot = async (tableData: packingSlotTableRowData): Promise<void> => {
    const data = processNewRowData(tableData);
    const { error } = await supabase.from("packing_slots").insert(data);

    if (error) {
        console.log(error);
        throw new DatabaseError("insert", "packing slots");
    }
};

export const updatePackingSlot = async (tableData: packingSlotTableRowData): Promise<void> => {
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
    const { error } = await supabase.from("packing_slots").delete().eq("primary_key", id);

    if (error) {
        throw new DatabaseError("delete", "packing slots");
    }
};

export const swapRows = async (
    rowOne: packingSlotTableRowData,
    rowTwo: packingSlotTableRowData
): Promise<void> => {
    const updatedRows = await swapOne(rowOne, rowTwo);

    if (rowOne.order - rowTwo.order > 0) {
        await swapTwoUp(updatedRows);
    } else {
        await swapTwoDown(updatedRows);
    }
};

const swapOne = async (
    rowOne: packingSlotTableRowData,
    rowTwo: packingSlotTableRowData
): Promise<DBPackingSlotData[]> => {
    const { data, error } = await supabase
        .from("packing_slots")
        .upsert([
            {
                primary_key: rowOne.id,
                order: -1,
                name: rowOne.name,
                is_shown: rowOne.is_shown,
            },
            {
                primary_key: rowTwo.id,
                order: rowOne.order,
                name: rowTwo.name,
                is_shown: rowTwo.is_shown,
            },
        ])
        .select();

    if (error) {
        console.log(error);
        throw new DatabaseError("update", "packing_slots");
    }

    return data;
};

const swapTwoUp = async (updatedRows: DBPackingSlotData[]): Promise<void> => {
    const { error } = await supabase
        .from("packing_slots")
        .update({
            order: updatedRows[1].order - 1,
        })
        .eq("primary_key", updatedRows[0].primary_key);

    if (error) {
        console.log(error);
        throw new DatabaseError("update", "packing_slots");
    }
};

const swapTwoDown = async (updatedRows: DBPackingSlotData[]): Promise<void> => {
    const { error } = await supabase
        .from("packing_slots")
        .update({
            order: updatedRows[1].order + 1,
        })
        .eq("primary_key", updatedRows[0].primary_key);

    if (error) {
        console.log(error);
        throw new DatabaseError("update", "packing_slots");
    }
};
