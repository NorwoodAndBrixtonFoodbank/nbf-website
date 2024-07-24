"use client";

import { DbWikiRow } from "@/databaseUtils";
import { WikiEditModeButton, WikiItemAccordionSurface } from "@/app/info/StyleComponents";
import { TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import supabase from "@/supabaseClient";
import { logErrorReturnLogId } from "@/logger/logger";

interface EditViewProps {
    rowData: DbWikiRow;
    setRowData: (row?: DbWikiRow) => void;
    setIsInEditMode: (isInEditMode: boolean) => void;
}

const deleteWikiItem = async (
    setIsInEditMode: (isInEditMode: boolean) => void,
    setRowData: (row?: DbWikiRow) => void,
    rowData?: DbWikiRow
): Promise<void> => {
    if (rowData) {
        const confirmation = confirm("Confirm deletion of this item?");
        if (confirmation) {
            const response = await supabase
                .from("wiki")
                .delete()
                .match({ wiki_key: rowData.wiki_key });
            if (response.error) {
                logErrorReturnLogId("error deleting wiki row item", response.error);
            }
            setIsInEditMode(false);
            setRowData(undefined);
            return;
        }
    }
};

const cancelWikiItemEdit = (setIsInEditMode: (isInEditMode: boolean) => void): void => {
    setIsInEditMode(false);
};

const updateWikiItem = async (
    rowData: DbWikiRow,
    newTitle: string,
    newContent: string,
    setIsInEditMode: (isInEditMode: boolean) => void,
    setRowData: (row: DbWikiRow) => void
): Promise<void> => {
    const confirmation = confirm("Confirm update of this item?");
    if (confirmation) {
        const response = await supabase
            .from("wiki")
            .update({ title: newTitle, content: newContent })
            .match({ wiki_key: rowData.wiki_key });
        if (response.error) {
            logErrorReturnLogId("error updating wiki row item", response.error);
        }
        setIsInEditMode(false);
        setRowData({
            title: newTitle,
            content: newContent,
            row_order: rowData.row_order,
            wiki_key: rowData.wiki_key,
        });
    }
};

const WikiItemEdit: React.FC<EditViewProps> = ({ rowData, setRowData, setIsInEditMode }) => {
    return (
        <>
            <WikiEditModeButton onClick={() => cancelWikiItemEdit(setIsInEditMode)}>
                <CancelIcon />
            </WikiEditModeButton>

            <WikiItemAccordionSurface>
                <TextField
                    id={`title_input_${rowData.wiki_key}`}
                    variant="outlined"
                    label="title"
                    defaultValue={rowData.title}
                />
                <div>
                    <TextField
                        id={`content_input_${rowData.wiki_key}`}
                        label="Content"
                        defaultValue={rowData.content}
                        multiline
                        rows={4}
                        margin="normal"
                        fullWidth={true}
                    />
                </div>

                <WikiEditModeButton
                    onClick={() => deleteWikiItem(setIsInEditMode, setRowData, rowData)}
                >
                    <DeleteIcon />
                </WikiEditModeButton>
                <WikiEditModeButton
                    onClick={() => {
                        const title_input = document.getElementById(
                            `title_input_${rowData.wiki_key}`
                        ) as HTMLInputElement;
                        const content_input = document.getElementById(
                            `content_input_${rowData.wiki_key}`
                        ) as HTMLInputElement;
                        updateWikiItem(
                            rowData,
                            title_input.value,
                            content_input.value,
                            setIsInEditMode,
                            setRowData
                        );
                    }}
                >
                    <SaveAltIcon />
                </WikiEditModeButton>
            </WikiItemAccordionSurface>
        </>
    );
};

export default WikiItemEdit;
