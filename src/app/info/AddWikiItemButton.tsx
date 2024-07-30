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
    doesEmptyRowExist: boolean;
    appendNewRow: (newRow: DbWikiRow, index: number) => void;
}

const AddWikiItemButton: React.FC<AddWikiItemButtonProps> = ({
    doesEmptyRowExist,
    appendNewRow,
}) => {
    const addWikiItem = async (): Promise<void> => {
        if (!doesEmptyRowExist) {
            const { data, error } = (await supabase
                .from("wiki")
                .insert({})
                .select()
                .single()) as WikiRowQueryType;
            error
                ? logErrorReturnLogId("error inserting and fetching new data", error)
                : appendNewRow(data, -1);
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
