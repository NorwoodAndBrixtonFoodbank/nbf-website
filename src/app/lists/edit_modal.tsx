"use client";

import Modal from "@/components/Modal/Modal";
import React, { useState } from "react";
import { styled } from "styled-components";
import { headers, tooltips } from "@/app/lists/dataview";
import TextInput from "@/components/DataInput/FreeFormTextInput";
import { Datum } from "@/components/Tables/Table";
import supabase from "@/supabase";
import Snackbar from "@mui/material/Snackbar/Snackbar";
import Alert from "@mui/material/Alert/Alert";
import Button from "@mui/material/Button/Button";

type Props = {
    onClose: () => void;
    /** null => add, undefined => modal closed, Datum => edit */
    data: Datum | null | undefined;
};

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
    const generateDefaultData = (): { [key: string]: string | null } => {
        if (data !== null && data !== undefined) {
            return { ...data.data, ...data.tooltips };
        }
        return {};
    };

    const [toSubmit, setToSubmit] = useState<{ [key: string]: string | null }>(
        generateDefaultData()
    );

    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const headersAndTooltips: [[string, string], [string, string]][] = [];
    const headersThatHaveTooltips = headers.filter(([key]) => key !== "item_name");

    for (let index = 0; index < headersThatHaveTooltips.length; index++) {
        headersAndTooltips.push([headersThatHaveTooltips[index], tooltips[index]]);
    }

    return (
        <Modal header="Edit List" headerId="editList" isOpen={data !== undefined} onClose={onClose}>
            <ModalInner>
                <h3>Description</h3>
                <TextInput
                    defaultValue={toSubmit.item_name ?? ""}
                    onChange={(event) => {
                        const text = event.target.value as string;
                        setToSubmit({ ...toSubmit, item_name: text });
                    }}
                    helperText="Description"
                />
                {headersAndTooltips.map(([[key, label], [tooltipKey]]) => {
                    return (
                        <DisplayContents key={key}>
                            <h3>{label}</h3>
                            <DataWithTooltipDiv>
                                <TextInput
                                    defaultValue={toSubmit[key] ?? ""}
                                    helperText={`${key}`}
                                    onChange={(event) => {
                                        const text = event.target.value as string;
                                        setToSubmit({ ...toSubmit, [key]: text });
                                    }}
                                />
                                <TextInput
                                    defaultValue={toSubmit[tooltipKey] ?? ""}
                                    helperText={`${tooltipKey}`}
                                    onChange={(event) => {
                                        const text = event.target.value as string;
                                        setToSubmit({ ...toSubmit, [tooltipKey]: text });
                                    }}
                                />
                            </DataWithTooltipDiv>
                        </DisplayContents>
                    );
                })}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={async () => {
                        let operation;

                        if (data === null) {
                            operation = supabase.from("lists").insert(toSubmit);
                        } else {
                            operation = supabase
                                .from("lists")
                                .update(toSubmit)
                                .eq("primary_key", toSubmit.primary_key)
                                .select();
                        }

                        const response = await operation;

                        if (Math.floor(response.status / 100) !== 2) {
                            setErrorMsg(
                                `${response.status}: ${response.statusText} -- data: ${response.data}`
                            );
                        } else {
                            onClose();
                        }
                    }}
                >
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

const SnackBarDiv = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;

    & .MuiAlert-standard {
        border-radius: 0.2rem;
        padding: 0 1rem;
    }
`;

export default EditModal;
