"use client";

import { DbWikiRow } from "@/databaseUtils";
import {
    ReorderArrowDiv,
    WikiEditModeButton,
    WikiItemAccordionSurface,
    WikiUpdateDataButton,
} from "@/app/info/StyleComponents";
import { TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import supabase from "@/supabaseClient";
import { logErrorReturnLogId } from "@/logger/logger";
import { WikiRowQueryType } from "@/app/info/AddWikiItemButton";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import { AuditLog, sendAuditLog } from "@/server/auditLog";

interface WikiItemEditProps {
    rowData: DbWikiRow;
    setRowData: (row?: DbWikiRow) => void;
    setIsInEditMode: (isInEditMode: boolean) => void;
    appendNewRow: (newRow: DbWikiRow, index: number) => void;
    removeRow: (row: DbWikiRow) => number;
    swapRows: (row1: DbWikiRow, upwards: boolean) => void;
    setErrorMessage: (error: string | null) => void;
}

const WikiItemEdit: React.FC<WikiItemEditProps> = ({
    rowData,
    setRowData,
    setIsInEditMode,
    appendNewRow,
    removeRow,
    swapRows,
    setErrorMessage,
}) => {
    const deleteWikiItem = async (): Promise<void> => {
        const deleteResponse = (await supabase
            .from("wiki")
            .delete()
            .match({ wiki_key: rowData.wiki_key })) as WikiRowQueryType;

        const auditLog = {
            action: "delete a wiki item",
            content: {
                itemName: rowData.title,
                itemPrimaryKey: rowData.wiki_key,
            },
        } as const satisfies Partial<AuditLog>;

        if (deleteResponse.error) {
            const logId = await logErrorReturnLogId(
                "error deleting wiki row item",
                deleteResponse.error
            );
            setErrorMessage(`Failed to delete wiki item. Log ID: ${logId}`);
            void sendAuditLog({
                ...auditLog,
                wasSuccess: false,
                logId: logId,
            });
        } else {
            void sendAuditLog({
                ...auditLog,
                wasSuccess: true,
            });
        }
        removeRow(rowData);
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

                const auditLog = {
                    action: "edit a wiki item",
                    wikiId: rowData.wiki_key,
                    content: {
                        itemTitle: newTitle,
                        itemContent: newContent,
                        rowOrder: rowData.row_order,
                    },
                } as const satisfies Partial<AuditLog>;
                if (updateResponse.error) {
                    const logId = await logErrorReturnLogId(
                        "error updating wiki row item",
                        updateResponse.error
                    );
                    setErrorMessage(`Failed to update wiki item. Log ID: ${logId}`);
                    void sendAuditLog({
                        ...auditLog,
                        wasSuccess: false,
                        logId: logId,
                    });
                } else {
                    const updatedRow: DbWikiRow = {
                        title: newTitle,
                        content: newContent,
                        row_order: rowData.row_order,
                        wiki_key: rowData.wiki_key,
                    };
                    const index: number = removeRow(rowData);
                    setRowData(updatedRow);
                    appendNewRow(updatedRow, index);
                    void sendAuditLog({
                        ...auditLog,
                        wasSuccess: true,
                    });
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
            <ReorderArrowDiv>
                <WikiUpdateDataButton
                    onClick={() => {
                        swapRows(rowData, true);
                    }}
                >
                    <KeyboardDoubleArrowUpIcon />
                </WikiUpdateDataButton>
                <WikiUpdateDataButton
                    onClick={() => {
                        swapRows(rowData, false);
                    }}
                >
                    <KeyboardDoubleArrowDownIcon />
                </WikiUpdateDataButton>
            </ReorderArrowDiv>

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
                    <SaveIcon />
                </WikiEditModeButton>
            </WikiItemAccordionSurface>
        </>
    );
};

export default WikiItemEdit;
