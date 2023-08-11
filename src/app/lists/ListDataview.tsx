"use client";

import Table, {
    ColumnDisplayFunction,
    ColumnStyleOptions,
    Datum,
    Row,
} from "@/components/Tables/Table";
import React, { useState } from "react";
import styled from "styled-components";
import EditModal, { EditModalState, listQuantityNoteAndLabels } from "@/app/lists/EditModal";
import supabase, { Schema } from "@/supabase";
import ConfirmDialog from "@/components/Modal/Confirm";
import Snackbar from "@mui/material/Snackbar/Snackbar";
import Alert from "@mui/material/Alert/Alert";
import Button from "@mui/material/Button";
import TooltipCell from "@/app/lists/TooltipCell";
import TableSurface from "@/components/Tables/TableSurface";

export type ListRow = Schema["lists"] & Datum;

interface Props {
    data: ListRow[];
}

export const headerKeysAndLabels: [string, string][] = [
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

const listDataviewColumnDisplayFunctions: { [headerKey: string]: ColumnDisplayFunction } = {};
const listsColumnStyleOptions: { [headerKey: string]: ColumnStyleOptions } = {};

listQuantityNoteAndLabels.forEach(([headerKey, noteKey]) => {
    if (headerKey.endsWith("quantity")) {
        // Column Display Function
        listDataviewColumnDisplayFunctions[headerKey] = (row: Row) => {
            const data = row.data as ListRow;
            return (
                <TooltipCell cellValue={data[headerKey] ?? ""} tooltipValue={data[noteKey] ?? ""} />
            );
        };

        // Column Style Function
        listsColumnStyleOptions[headerKey] = {
            minWidth: "9rem",
            center: true,
        };
    }
});

const ListsDataView: React.FC<Props> = (props) => {
    const [modal, setModal] = useState<EditModalState>();
    const [toDelete, setToDelete] = useState<number | null>(null);
    // need another setState otherwise the modal content changes before the close animation finishes
    const [toDeleteModalOpen, setToDeleteModalOpen] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    if (props.data === null) {
        throw new Error("No data found");
    }

    const toggleableHeaders = headerKeysAndLabels.map(([key]) => key);

    // remove description header
    toggleableHeaders.shift();

    const onEdit = (index: number): void => {
        setModal(props.data[index]);
    };

    const onDeleteButtonClick = (index: number): void => {
        setToDelete(index);
        setToDeleteModalOpen(true);
    };

    const onConfirmDeletion = async (): Promise<void> => {
        if (toDelete !== null) {
            const data = props.data[toDelete];
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
                    toDelete ? props.data[toDelete].item_name : ""
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

            <EditModal onClose={() => setModal(undefined)} data={modal} key={modal?.primary_key} />

            <TableSurface>
                <Table
                    checkboxes={false}
                    headerKeysAndLabels={headerKeysAndLabels}
                    toggleableHeaders={toggleableHeaders}
                    defaultShownHeaders={["item_name", ...toggleableHeaders]}
                    data={props.data}
                    reorderable
                    headerFilters={["item_name"]}
                    pagination={false}
                    onEdit={onEdit}
                    onDelete={onDeleteButtonClick}
                    sortable={false}
                    columnDisplayFunctions={listDataviewColumnDisplayFunctions}
                    columnStyleOptions={listsColumnStyleOptions}
                />
                <ButtonMargin>
                    <Button variant="contained" onClick={() => setModal(null)}>
                        + Add
                    </Button>
                </ButtonMargin>
            </TableSurface>
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

const ButtonMargin = styled.div`
    margin: 15px 5px 5px 0;
`;

export default ListsDataView;
