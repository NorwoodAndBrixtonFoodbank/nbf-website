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
    rowRef?: DbWikiRow;
    setRowRef: (row?: DbWikiRow) => void;
    setEditModeRef: (editMode: boolean) => void;
}

const deleteWikiItem = async (
    setEditModeRef: (editMode: boolean) => void,
    setRowRef: (row?: DbWikiRow) => void,
    rowRef?: DbWikiRow
): Promise<void> => {
    if (rowRef) {
        const result = confirm("Confirm deletion of this item?");
        if (result) {
            const response = await supabase
                .from("wiki")
                .delete()
                .match({ wiki_key: rowRef.wiki_key });
            if (response.error) {
                logErrorReturnLogId("error fetching wiki data", response.error);
            }
            setEditModeRef(false);
            setRowRef(undefined);
            return;
        }
    }
};

const cancelWikiItemEdit = (setEditModeRef: (editMode: boolean) => void): void => {
    setEditModeRef(false);
};

const updateWikiItem = async (
    rowRef: DbWikiRow,
    newTitle: string,
    newContent: string,
    setEditModeRef: (editMode: boolean) => void,
    setRowRef: (row: DbWikiRow) => void
): Promise<void> => {
    const result = confirm("Confirm update of this item?");
    if (result) {
        const response = await supabase
            .from("wiki")
            .update({ title: newTitle, content: newContent })
            .match({ wiki_key: rowRef.wiki_key });
        if (response.error) {
            logErrorReturnLogId("error fetching wiki data", response.error);
        }
        setEditModeRef(false);
        setRowRef({
            title: newTitle,
            content: newContent,
            row_order: rowRef.row_order,
            wiki_key: rowRef.wiki_key,
        });
    }
};

const EditWikiItemView: React.FC<EditViewProps> = ({ rowRef, setRowRef, setEditModeRef }) => {
    return (
        <>
            {rowRef && (
                <>
                    <WikiEditModeButton
                        onClick={() => deleteWikiItem(setEditModeRef, setRowRef, rowRef)}
                    >
                        <DeleteIcon />
                    </WikiEditModeButton>

                    <WikiItemAccordionSurface>
                        <TextField
                            id={`title_input_${rowRef.wiki_key}`}
                            variant="outlined"
                            label="title"
                            defaultValue={rowRef.title}
                        />
                        <div>
                            <TextField
                                id={`content_input_${rowRef.wiki_key}`}
                                label="Content"
                                defaultValue={rowRef.content}
                                multiline
                                rows={4}
                                margin="normal"
                                fullWidth={true}
                            />
                        </div>
                        <WikiEditModeButton onClick={() => cancelWikiItemEdit(setEditModeRef)}>
                            {" "}
                            <CancelIcon />{" "}
                        </WikiEditModeButton>
                        <WikiEditModeButton
                            onClick={() => {
                                const title_input = document.getElementById(
                                    `title_input_${rowRef.wiki_key}`
                                ) as HTMLInputElement;
                                const content_input = document.getElementById(
                                    `content_input_${rowRef.wiki_key}`
                                ) as HTMLInputElement;
                                updateWikiItem(
                                    rowRef,
                                    title_input.value,
                                    content_input.value,
                                    setEditModeRef,
                                    setRowRef
                                );
                            }}
                        >
                            {" "}
                            <SaveAltIcon />{" "}
                        </WikiEditModeButton>
                    </WikiItemAccordionSurface>
                </>
            )}
        </>
    );
};

export default EditWikiItemView;
