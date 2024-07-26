"use client";

import { DbWikiRow } from "@/databaseUtils";
import { ButtonMargin } from "@/app/info/StyleComponents";
import { Button } from "@mui/material";
import supabase from "@/supabaseClient";
import { logErrorReturnLogId } from "@/logger/logger";
import { PostgrestError } from "@supabase/supabase-js";

interface WikiRowQuerySuccessType {
    data: DbWikiRow;
    error: null;
}

interface WikiRowQueryFailureType {
    data: null;
    error: PostgrestError;
}
export type WikiRowQueryType = WikiRowQuerySuccessType | WikiRowQueryFailureType;

interface AddWikiItemButtonProps {
    sortedRows: DbWikiRow[];
    setSortedRows: (rows: DbWikiRow[]) => void;
}

const AddWikiItemButton: React.FC<AddWikiItemButtonProps> = ({ sortedRows, setSortedRows }) => {
    const addWikiItem = async (): Promise<void> => {
        if (
            sortedRows.filter((row) => {
                return !row.title && !row.content;
            }).length === 0
        ) {
            const { data, error } = (await supabase
                .from("wiki")
                .insert({})
                .select()
                .single()) as WikiRowQueryType;
            error
                ? logErrorReturnLogId("error inserting and fetching new data", error)
                : setSortedRows([...sortedRows, data]);
        }
    };

    return (
        <ButtonMargin>
            <Button variant="contained" onClick={addWikiItem}>
                + Add
            </Button>
        </ButtonMargin>
    );
};

export default AddWikiItemButton;
