"use client";

import Table, { Datum, RowData } from "@/components/Tables/Table";
import React, { useState } from "react";
import styled from "styled-components";
import EditModal, { EditModalState } from "@/app/lists/EditModal";
import supabase, { Schema } from "@/supabase";
import ConfirmDialog from "@/components/Modal/Confirm";
import Snackbar from "@mui/material/Snackbar/Snackbar";
import Alert from "@mui/material/Alert/Alert";

type ListRow = Schema["lists"];

interface Props {
    data: ListRow[];
}

export const headers: [string, string][] = [
    ["item_name", "Description"],
    ["1_quantity", "Single"],
    ["2_quantity", "Family of 2"],
    ["3_quantity", "Family of 3"],
    ["4_quantity", "Family of 4"],
    ["5_quantity", "Family of 5"],
    ["6_quantity", "Family of 6"],
    ["7_quantity", "Family of 7"],
    ["8_quantity", "Family of 8"],
    ["9_quantity", "Family of 9"],
    ["10_quantity", "Family of 10+"],
];

export const tooltips: [string, string][] = [
    ["1_notes", "Single"],
    ["2_notes", "Family of 2"],
    ["3_notes", "Family of 3"],
    ["4_notes", "Family of 4"],
    ["5_notes", "Family of 5"],
    ["6_notes", "Family of 6"],
    ["7_notes", "Family of 7"],
    ["8_notes", "Family of 8"],
    ["9_notes", "Family of 9"],
    ["10_notes", "Family of 10+"],
];

interface RemappedData extends Datum {
    unmappedTooltips: RowData;
}

const ListsDataView: React.FC<Props> = ({ data: rawData }) => {
    const [modal, setModal] = useState<EditModalState>();
    const [toDelete, setToDelete] = useState<number | null>(null);
    // need another setState otherwise the modal content changes before the close animation finishes
    const [toDeleteModalOpen, setToDeleteModalOpen] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    if (rawData === null) {
        throw new Error("No data found");
    }

    const remapTooltips = (row: ListRow): RemappedData => {
        const data: RowData = {
            item_name: row.item_name,
            primary_key: row.primary_key,
        };
        const mappedTooltips: RowData = {};
        const unmappedTooltips: RowData = {};

        for (const [key, value] of Object.entries(row)) {
            if (value !== null) {
                if (key.endsWith("quantity")) {
                    data[key] = value;
                } else if (key.endsWith("notes")) {
                    mappedTooltips[key.replace("notes", "quantity")] = value;
                    unmappedTooltips[key] = value;
                }
            }
        }

        return {
            data,
            tooltips: mappedTooltips,
            unmappedTooltips,
        };
    };

    const dataAndTooltips = rawData.map(remapTooltips);

    const toggleableHeaders = headers.map(([key]) => key);

    // remove description header
    toggleableHeaders.shift();

    const onEdit = (index: number): void => {
        const row = rawData[index];

        const editData = remapTooltips(row);

        setModal({
            data: editData.data,
            tooltips: editData.unmappedTooltips,
        });
    };

    const onDeleteButtonClick = (index: number): void => {
        setToDelete(index);
        setToDeleteModalOpen(true);
    };

    const onConfirmDeletion = async (): Promise<void> => {
        if (toDelete !== null) {
            const data = rawData[toDelete];
            const { error } = await supabase
                .from("lists")
                .delete()
                .eq("primary_key", data.primary_key);

            if (error) {
                setErrorMsg(error.message);
            } else {
                window.location.reload();
            }
        }
    };

    return (
        <>
            <ConfirmDialog
                message={`Are you sure you want to delete ${
                    toDelete ? rawData[toDelete].item_name : ""
                }?`}
                isOpen={toDeleteModalOpen}
                onConfirm={onConfirmDeletion}
                onCancel={() => {
                    setToDeleteModalOpen(false);
                }}
            />
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
            <EditModal
                onClose={() => setModal(undefined)}
                data={modal}
                key={modal?.data?.primary_key}
            />
            <TableDiv>
                <Table
                    checkboxes={false}
                    headerKeysAndLabels={headers}
                    toggleableHeaders={toggleableHeaders}
                    defaultShownHeaders={["item_name", ...toggleableHeaders]}
                    data={dataAndTooltips}
                    reorderable
                    headerFilters={["item_name"]}
                    pagination={false}
                    onEdit={onEdit}
                    onDelete={onDeleteButtonClick}
                    sortable={false}
                />
                <StyledAddButton onClick={() => setModal(null)}>+ Add</StyledAddButton>
            </TableDiv>
        </>
    );
};

export const SnackBarDiv = styled.div`
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

const TableDiv = styled.div`
    margin: 20px;
    padding: 20px;
    background-color: ${(props) => props.theme.surfaceBackgroundColor};
    border: solid 1px ${(props) => props.theme.surfaceForegroundColor};
    border-radius: 1rem;
`;

const StyledAddButton = styled.button`
    margin: 10px 5px 5px 0;
    height: 2rem;
    width: 5rem;
`;

export default ListsDataView;
