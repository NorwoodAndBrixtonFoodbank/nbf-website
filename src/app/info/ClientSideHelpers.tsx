"use client";

import { RoleUpdateContext } from "@/app/roles";
import { DbWikiRow } from "@/databaseUtils";
import { useContext, useState } from "react";
import {
    WikiEditModeButton,
    MultilineInput,
    WikiItemAccordionSurface,
    WikiUpdateDataButton,
} from "./StyleComponents";
import UpdateIcon from "@mui/icons-material/Update";
import { Accordion, AccordionDetails, AccordionSummary, TextField } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { convertContentToElements } from "./WikiItems";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import supabase from "@/supabaseClient";
import { logErrorReturnLogId } from "@/logger/logger";

export const enterEditMode = (setEditMode: (editMode: boolean) => void): void => {
    setEditMode(true);
};

interface RoleProps {
    children?: React.ReactNode;
}

interface EditProps {
    editMode: boolean;
    row?: DbWikiRow;
}

interface EditViewProps {
    rowRef?: DbWikiRow;
    setRowRef: (row?: DbWikiRow) => void;
    editModeRef: boolean;
    setEditModeRef: (editMode: boolean) => void;
}

export const EditModeDependentItem: React.FC<EditProps> = ({ editMode, row }) => {
    const [rowRef, setRowRef] = useState<DbWikiRow | undefined>(row);
    const [editModeRef, setEditModeRef] = useState(editMode);
    return (
        <>
            {!editModeRef ? (
                <DefaultView
                    rowRef={rowRef}
                    setRowRef={setRowRef}
                    editModeRef={editModeRef}
                    setEditModeRef={setEditModeRef}
                />
            ) : (
                <EditView
                    rowRef={rowRef}
                    setRowRef={setRowRef}
                    editModeRef={editModeRef}
                    setEditModeRef={setEditModeRef}
                />
            )}
        </>
    );
};

const cancelWikiItemEdit = (setEditModeRef: (editMode: boolean) => void): void => {
    setEditModeRef(false);
};

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
const DefaultView: React.FC<EditViewProps> = ({
    rowRef,
    setRowRef,
    editModeRef,
    setEditModeRef,
}) => {
    return (
        <>
            {rowRef && (
                <>
                    <AdminManagerDependent>
                        <WikiUpdateDataButton
                            onClick={() => {
                                setEditModeRef(true);
                            }}
                        >
                            <UpdateIcon />
                        </WikiUpdateDataButton>
                    </AdminManagerDependent>
                    <WikiItemAccordionSurface>
                        <Accordion elevation={0}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1-content"
                                id="panel1-header"
                            >
                                <h2>{rowRef.title}</h2>
                            </AccordionSummary>
                            <AccordionDetails>
                                {convertContentToElements(rowRef.content)}
                            </AccordionDetails>
                        </Accordion>
                    </WikiItemAccordionSurface>
                </>
            )}
        </>
    );
};

const EditView: React.FC<EditViewProps> = ({ rowRef, setRowRef, editModeRef, setEditModeRef }) => {
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

export const AdminManagerDependent: React.FC<RoleProps> = (props) => {
    const { role } = useContext(RoleUpdateContext);

    return <>{(role === "admin" || role === "manager") && props.children}</>;
};
