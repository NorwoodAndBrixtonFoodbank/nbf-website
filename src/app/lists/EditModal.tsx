"use client";

import Modal from "@/components/Modal/Modal";
import React, { useState } from "react";
import styled from "styled-components";
import { ListRow, QuantityAndNotes, SnackBarDiv, listRowToListDB } from "@/app/lists/ListDataview";
import TextInput from "@/components/DataInput/FreeFormTextInput";
import supabase from "@/supabaseClient";
import { Schema } from "@/databaseUtils";
import Snackbar from "@mui/material/Snackbar/Snackbar";
import Alert from "@mui/material/Alert/Alert";
import Button from "@mui/material/Button/Button";

interface Props {
    onClose: () => void;
    data: EditModalState;
}

// null => add, undefined => modal closed
export type EditModalState = ListRow | null | undefined;

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

const listQuantityNoteAndLabels: [keyof Schema["lists"], keyof Schema["lists"], string, string][] =
    [
        ["quantity_for_1", "notes_for_1", "Single", "1"],
        ["quantity_for_2", "notes_for_2", "Family of 2", "2"],
        ["quantity_for_3", "notes_for_3", "Family of 3", "3"],
        ["quantity_for_4", "notes_for_4", "Family of 4", "4"],
        ["quantity_for_5", "notes_for_5", "Family of 5", "5"],
        ["quantity_for_6", "notes_for_6", "Family of 6", "6"],
        ["quantity_for_7", "notes_for_7", "Family of 7", "7"],
        ["quantity_for_8", "notes_for_8", "Family of 8", "8"],
        ["quantity_for_9", "notes_for_9", "Family of 9", "9"],
        ["quantity_for_10", "notes_for_10", "Family of 10+", "10"],
    ];

const EditModal: React.FC<Props> = ({ data, onClose }) => {
    const [toSubmit, setToSubmit] = useState<ListRow | null | undefined>(data);

    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const setKey = (event: React.ChangeEvent<HTMLInputElement>, key: string): void => {
        const newValue = event.target.value;
        toSubmit && setToSubmit({ ...toSubmit, [key]: newValue });
    };

    const onSubmit = async (): Promise<void> => {
        if (toSubmit) {
            const toSubmitDB = listRowToListDB(toSubmit);
            const table = supabase.from("lists");
            const { error } =
                data === null
                    ? await table.insert(toSubmitDB)
                    : await table.update(toSubmitDB).eq("primary_key", toSubmitDB.primary_key);

            if (error) {
                setErrorMsg(error.message);
            } else {
                window.location.reload();
            }
        }
    };

    const Footer = (
        <>
            <Button variant="contained" color="primary" onClick={onSubmit}>
                Submit
            </Button>
            <Snackbar
                message={errorMsg}
                autoHideDuration={3000}
                onClose={() => setErrorMsg(null)}
                open={errorMsg !== null}
            >
                <SnackBarDiv>
                    <Alert severity="error">{errorMsg}</Alert>
                </SnackBarDiv>
            </Snackbar>
        </>
    );

    if (toSubmit) {
        return (
            <Modal
                header={"Edit List Item - " + toSubmit.itemName}
                headerId="editList"
                isOpen={data !== undefined}
                onClose={onClose}
                footer={Footer}
            >
                <ModalInner>
                    <h3>Description</h3>
                    <TextInput
                        defaultValue={toSubmit.itemName ?? ""}
                        onChange={(event) => setKey(event, "item_name")}
                        label="Item Description"
                    />
                    {listQuantityNoteAndLabels.map(([quantityKey, noteKey, label, listRowKey]) => {
                        const quantityAndNotes = toSubmit[
                            listRowKey as keyof ListRow
                        ] as QuantityAndNotes;
                        return (
                            <DisplayContents key={quantityKey}>
                                <h3>{label}</h3>
                                <DataWithTooltipDiv>
                                    <TextInput
                                        defaultValue={quantityAndNotes.quantity.toString() ?? ""}
                                        label="Quantity"
                                        onChange={(event) => setKey(event, quantityKey)}
                                    />
                                    <TextInput
                                        defaultValue={quantityAndNotes.notes?.toString() ?? ""}
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
    }
};

export default EditModal;
