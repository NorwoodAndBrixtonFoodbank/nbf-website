"use client";

import { DbWikiRow } from "@/databaseUtils";
import { WikiEditModeButton, WikiItemAccordionSurface } from "@/app/info/StyleComponents";
import { TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import supabase from "@/supabaseClient";
import { logErrorReturnLogId } from "@/logger/logger";
import { WikiRowQueryType } from "@/app/info/AddWikiItemButton";

interface WikiItemEditProps {
    rowData: DbWikiRow;
    setRowData: (row?: DbWikiRow) => void;
    setIsInEditMode: (isInEditMode: boolean) => void;
    sortedRows: DbWikiRow[];
}

const WikiItemEdit: React.FC<WikiItemEditProps> = ({
    rowData,
    setRowData,
    setIsInEditMode,
    sortedRows,
}) => {
    const deleteWikiItem = async (): Promise<void> => {
        const deleteResponse = (await supabase
            .from("wiki")
            .delete()
            .match({ wiki_key: rowData.wiki_key })) as WikiRowQueryType;
        if (deleteResponse.error) {
            logErrorReturnLogId("error deleting wiki row item", deleteResponse.error);
        }
        const indexToRemove: number = sortedRows.findIndex(
            (row) => row.wiki_key === rowData.wiki_key
        );
        sortedRows.splice(indexToRemove, 1);
        setRowData(undefined);
    };

    const cancelWikiItemEdit = (): void => {
        !rowData.title && !rowData.content ? deleteWikiItem() : setIsInEditMode(false);
    };

    const updateWikiItem = async (newTitle: string, newContent: string): Promise<void> => {
        if (!newTitle && !newContent) {
            const deleteUpdateConfirmation: boolean = confirm(
                "Saving an item to be empty will delete it. Are you sure?"
            );
            if (deleteUpdateConfirmation) {
                deleteWikiItem();
            }
        } else {
            const updateConfirmation: boolean = confirm("Confirm update of this item?");
            if (updateConfirmation) {
                const updateResponse = (await supabase.from("wiki").upsert({
                    title: newTitle,
                    content: newContent,
                    wiki_key: rowData.wiki_key,
                })) as WikiRowQueryType;
                if (updateResponse.error) {
                    logErrorReturnLogId("error updating wiki row item", updateResponse.error);
                } else {
                    const updatedRow: DbWikiRow = {
                        title: newTitle,
                        content: newContent,
                        row_order: rowData.row_order,
                        wiki_key: rowData.wiki_key,
                    };
                    setRowData(updatedRow);
                    if (!rowData.title && !rowData.content) {
                        sortedRows.splice(-1, 1);
                    }
                    sortedRows.push(updatedRow);
                }
            }
            setIsInEditMode(false);
        }
    };

    const deleteWikiItemWithConfirmation = async (): Promise<void> => {
        if (!rowData.title && !rowData.content) {
            deleteWikiItem();
        } else {
            const confirmation: boolean = confirm("Confirm deletion of this item?");
            if (confirmation) {
                deleteWikiItem();
            }
        }
    };

    return (
        <>
            <WikiEditModeButton onClick={cancelWikiItemEdit}>
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

                <WikiEditModeButton onClick={deleteWikiItemWithConfirmation}>
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
                        updateWikiItem(title_input.value, content_input.value);
                    }}
                >
                    <SaveAltIcon />
                </WikiEditModeButton>
            </WikiItemAccordionSurface>
        </>
    );
};

export default WikiItemEdit;
