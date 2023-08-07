"use client";

import Modal from "@/components/Modal/Modal";
import React, { useState } from "react";
import styled from "styled-components";
import { SnackBarDiv, headers, tooltips } from "@/app/lists/ListDataview";
import TextInput from "@/components/DataInput/FreeFormTextInput";
import { Datum, RowData } from "@/components/Tables/Table";
import supabase from "@/supabase";
import Snackbar from "@mui/material/Snackbar/Snackbar";
import Alert from "@mui/material/Alert/Alert";
import Button from "@mui/material/Button/Button";

interface Props {
    onClose: () => void;
    data: EditModalState;
}

// null => add, undefined => modal closed
export type EditModalState = Datum | null | undefined;

type HeadersAndTooltips = [[string, string], [string, string]][];

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

const EditModal: React.FC<Props> = ({ data, onClose }) => {
    const [toSubmit, setToSubmit] = useState<RowData>(
        data ? { ...data.data, ...data.tooltips } : {}
    );

    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const headersThatHaveTooltips = headers.filter(([key]) => key !== "item_name");

    const headersAndTooltips: HeadersAndTooltips = headersThatHaveTooltips.map((header, index) => [
        header,
        tooltips[index],
    ]);

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
                    helperText="Description"
                />
                {headersAndTooltips.map(([[key, label], [tooltipKey]]) => {
                    return (
                        <DisplayContents key={key}>
                            <h3>{label}</h3>
                            <DataWithTooltipDiv>
                                <TextInput
                                    defaultValue={toSubmit[key] ?? ""}
                                    helperText="Quantity"
                                    onChange={(event) => setKey(event, key)}
                                />
                                <TextInput
                                    defaultValue={toSubmit[tooltipKey] ?? ""}
                                    helperText="Notes"
                                    onChange={(event) => setKey(event, tooltipKey)}
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
