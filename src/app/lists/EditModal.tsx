"use client";

import Modal from "@/components/Modal/Modal";
import React, { useState } from "react";
import styled from "styled-components";
import { SnackBarDiv } from "@/app/lists/ListDataview";
import TextInput from "@/components/DataInput/FreeFormTextInput";
import supabase from "@/supabaseClient";
import { Schema } from "@/databaseUtils";
import Snackbar from "@mui/material/Snackbar/Snackbar";
import Alert from "@mui/material/Alert/Alert";
import Button from "@mui/material/Button/Button";
import { AuditLog, sendAuditLog } from "@/server/auditLog";
import { logErrorReturnLogId } from "@/logger/logger";

interface Props {
    onClose: () => void;
    data: EditModalState;
}

// null => add, undefined => modal closed
export type EditModalState = Schema["lists"] | null | undefined;

const ModalInner = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const DataWithTooltipDiv = styled.div`
    display: flex;
    gap: 1rem;
    flex-direction: column;

    @media (min-width: 600px) {
        flex-direction: row;
    }
`;

const DisplayContents = styled.div`
    display: contents;
`;

const listQuantityNoteAndLabels: [keyof Schema["lists"], keyof Schema["lists"], string][] = [
    ["quantity_for_1", "notes_for_1", "Single"],
    ["quantity_for_2", "notes_for_2", "Family of 2"],
    ["quantity_for_3", "notes_for_3", "Family of 3"],
    ["quantity_for_4", "notes_for_4", "Family of 4"],
    ["quantity_for_5", "notes_for_5", "Family of 5"],
    ["quantity_for_6", "notes_for_6", "Family of 6"],
    ["quantity_for_7", "notes_for_7", "Family of 7"],
    ["quantity_for_8", "notes_for_8", "Family of 8"],
    ["quantity_for_9", "notes_for_9", "Family of 9"],
    ["quantity_for_10", "notes_for_10", "Family of 10+"],
];

const EditModal: React.FC<Props> = ({ data, onClose }) => {
    const [toSubmit, setToSubmit] = useState<Partial<Schema["lists"]>>(data ?? {});

    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const setKey = (event: React.ChangeEvent<HTMLInputElement>, key: string): void => {
        const newValue = event.target.value;
        setToSubmit({ ...toSubmit, [key]: newValue });
    };

    const onSubmit = async (): Promise<void> => {
        if (data === null) {
            const { data: returnedListData, error: insertListItemError } = await supabase
                .from("lists")
                .insert(toSubmit)
                .select()
                .single();

            const auditLog = {
                content: { itemDetails: toSubmit },
                action: "add a list item",
            } as const satisfies Partial<AuditLog>;

            if (insertListItemError) {
                const logId = await logErrorReturnLogId("failed to insert list item", {
                    error: insertListItemError,
                });
                await sendAuditLog({ ...auditLog, wasSuccess: false, logId });
                setErrorMessage(`Error: failedToInsertListItem. Log ID: ${logId}`);
                return;
            }

            await sendAuditLog({
                ...auditLog,
                wasSuccess: true,
                listId: returnedListData.primary_key,
            });
        } else {
            const { data: returnedListData, error: updateListItemError } = await supabase
                .from("lists")
                .update(toSubmit)
                .eq("primary_key", toSubmit.primary_key)
                .select()
                .single();

            const auditLog = {
                content: toSubmit ?? {},
                action: "edit a list item",
            } as const satisfies Partial<AuditLog>;

            if (updateListItemError) {
                const logId = await logErrorReturnLogId("failed to update list item", {
                    error: updateListItemError,
                });
                await sendAuditLog({ ...auditLog, wasSuccess: false, logId });
                setErrorMessage(`Error: failedToUpdateListItem. Log ID: ${logId}`);
                return;
            }
            await sendAuditLog({
                ...auditLog,
                wasSuccess: true,
                listId: returnedListData.primary_key,
            });
        }

        setToSubmit({});
        onClose();
    };

    const Footer = (
        <>
            <Button variant="contained" color="primary" onClick={onSubmit}>
                Submit
            </Button>
            <Snackbar
                message={errorMessage}
                onClose={() => setErrorMessage(null)}
                open={errorMessage !== null}
            >
                <SnackBarDiv>
                    <Alert severity="error">{errorMessage}</Alert>
                </SnackBarDiv>
            </Snackbar>
        </>
    );

    return (
        <Modal
            header={"Edit List Item - " + toSubmit.item_name}
            headerId="editList"
            isOpen={data !== undefined}
            onClose={onClose}
            footer={Footer}
        >
            <ModalInner>
                <h3>Description</h3>
                <TextInput
                    defaultValue={toSubmit.item_name ?? ""}
                    onChange={(event) => setKey(event, "item_name")}
                    label="Item Description"
                />
                {listQuantityNoteAndLabels.map(([quantityKey, noteKey, label]) => {
                    return (
                        <DisplayContents key={quantityKey}>
                            <h3>{label}</h3>
                            <DataWithTooltipDiv>
                                <TextInput
                                    defaultValue={toSubmit[quantityKey]?.toString() ?? ""}
                                    label="Quantity"
                                    onChange={(event) => setKey(event, quantityKey)}
                                />
                                <TextInput
                                    defaultValue={toSubmit[noteKey]?.toString() ?? ""}
                                    label="Notes"
                                    onChange={(event) => setKey(event, noteKey)}
                                    fullWidth
                                />
                            </DataWithTooltipDiv>
                        </DisplayContents>
                    );
                })}
            </ModalInner>
        </Modal>
    );
};

export default EditModal;
