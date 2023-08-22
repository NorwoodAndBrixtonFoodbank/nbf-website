"use client";

import Modal from "@/components/Modal/Modal";
import React, { useState } from "react";
import styled from "styled-components";
import { SnackBarDiv } from "@/app/lists/ListDataview";
import TextInput from "@/components/DataInput/FreeFormTextInput";
import supabase from "@/supabaseClient";
import { Schema } from "@/database_utils";
import Snackbar from "@mui/material/Snackbar/Snackbar";
import Alert from "@mui/material/Alert/Alert";
import Button from "@mui/material/Button/Button";
import { Datum } from "@/components/Tables/Table";

interface Props {
    onClose: () => void;
    data: EditModalState;
}

// null => add, undefined => modal closed
export type EditModalState = Datum | null | undefined;

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

export const listQuantityNoteAndLabels: [keyof Schema["lists"], keyof Schema["lists"], string][] = [
    ["1_quantity", "1_notes", "Single"],
    ["2_quantity", "2_notes", "Family of 2"],
    ["3_quantity", "3_notes", "Family of 3"],
    ["4_quantity", "4_notes", "Family of 4"],
    ["5_quantity", "5_notes", "Family of 5"],
    ["6_quantity", "6_notes", "Family of 6"],
    ["7_quantity", "7_notes", "Family of 7"],
    ["8_quantity", "8_notes", "Family of 8"],
    ["9_quantity", "9_notes", "Family of 9"],
    ["10_quantity", "10_notes", "Family of 10+"],
];

const EditModal: React.FC<Props> = ({ data, onClose }) => {
    const [toSubmit, setToSubmit] = useState<Partial<Schema["lists"]>>(data ? data : {});

    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const setKey = (event: React.ChangeEvent<HTMLInputElement>, key: string): void => {
        const newValue = event.target.value;
        setToSubmit({ ...toSubmit, [key]: newValue });
    };

    const onSubmit = async (): Promise<void> => {
        const table = supabase.from("lists");
        const { error } =
            data === null
                ? await table.insert(toSubmit)
                : await table.update(toSubmit).eq("primary_key", toSubmit.primary_key);

        if (error) {
            setErrorMsg(error.message);
        } else {
            window.location.reload();
        }
    };

    return (
        <Modal header="Edit List" headerId="editList" isOpen={data !== undefined} onClose={onClose}>
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
                                />
                            </DataWithTooltipDiv>
                        </DisplayContents>
                    );
                })}
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
            </ModalInner>
        </Modal>
    );
};

export default EditModal;
