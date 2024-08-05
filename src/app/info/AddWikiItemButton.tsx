"use client";

import React from "react";
import { DbWikiRow } from "@/databaseUtils";
import { ButtonMargin } from "@/app/info/StyleComponents";
import { Button } from "@mui/material";
import { logErrorReturnLogId } from "@/logger/logger";
import { PostgrestError } from "@supabase/supabase-js";
import { insertSupabaseCall } from "./supabaseCall";

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
        if (doesEmptyRowExist) {
            return;
        }

        const insertResponse = await insertSupabaseCall();

        insertResponse.error
            ? logErrorReturnLogId("error inserting and fetching new data", insertResponse.error)
            : appendNewRow(insertResponse.data, -1);
    };

    return (
        <ButtonMargin>
            <Button variant="contained" onClick={addWikiItem} data-testid="#add">
                + Add
            </Button>
        </ButtonMargin>
    );
};

export default AddWikiItemButton;
