"use client";

import Table, { Datum } from "@/components/Tables/Table";
import { Database } from "@/database_types_file";
import React, { useState } from "react";
import { styled } from "styled-components";
import EditModal from "./edit_modal";
import supabase from "@/supabase";
import ConfirmDialog from "@/components/Modal/Confirm";
import Snackbar from "@mui/material/Snackbar/Snackbar";
import Alert from "@mui/material/Alert/Alert";

export type ListRow = Database["public"]["Tables"]["lists"]["Row"];

const TableDiv = styled.div`
    margin: 20px;
    padding: 20px;
    background-color: ${(props) => props.theme.surfaceBackgroundColor};
    border: solid 1px ${(props) => props.theme.surfaceForegroundColor};
    border-radius: 1rem;
`;

const StyledTable = styled(Table)`
    width: 100%;
    background-color: transparent;
`;

const StyledAddButton = styled.button`
    margin: 10px 5px 5px 0;
    height: 2rem;
    width: 5rem;
`;

type Props = {
    data: ListRow[] | null;
};

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

const ListsDataView: React.FC<Props> = ({ data: rawData }) => {
    // null => add, undefined => modal closed
    const [modal, setModal] = useState<Datum | null | undefined>(undefined);
    const [toDelete, setToDelete] = useState<number | null>(null);
    // need another setState otherwise the modal content changes before the close animation finishes
    const [toDeleteModalOpen, setToDeleteModalOpen] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    if (rawData === null) {
        throw new Error("No data found");
    }

    const remapTooltips = (
        row: ListRow
    ): Datum & { unmappedTooltips: { [key: string]: string | null } } => {
        const data: { [key: string]: string | null } = {
            item_name: row.item_name,
            primary_key: row.primary_key,
        };
        const tooltips: { [key: string]: string | null } = {};
        const unmappedTooltips: { [key: string]: string | null } = {};

        for (const [key, value] of Object.entries(row)) {
            if (key.endsWith("quantity")) {
                data[key] = value;
            } else if (key.endsWith("notes")) {
                tooltips[key.replace("notes", "quantity")] = value;
                unmappedTooltips[key] = value;
            }
        }

        return {
            data,
            tooltips,
            unmappedTooltips,
        };
    };

    const dataAndTooltips = rawData?.map(remapTooltips);

    // extract header keys
    const toggleableHeaders = headers.map(([key]) => key);
    // removing description header from Toggleable Headers using shift
    toggleableHeaders.shift();

    const onEdit = (index: number): void => {
        const row = rawData[index];

        const editData = remapTooltips(row!);

        setModal({
            data: editData.data,
            tooltips: editData.unmappedTooltips,
        });
    };

    const onDelete = async (index: number): Promise<void> => {
        setToDelete(index);
        setToDeleteModalOpen(true);
    };

    return (
        <>
            <ConfirmDialog
                message={`Are you sure you want to delete ${
                    toDelete ? rawData[toDelete].item_name : ""
                }?`}
                isOpen={toDeleteModalOpen}
                onConfirm={async () => {
                    if (toDelete !== null) {
                        const data = rawData[toDelete];
                        const response = await supabase
                            .from("lists")
                            .delete()
                            .match({ primary_key: data.primary_key });

                        if (Math.floor(response.status / 100) !== 2) {
                            setErrorMsg(
                                `${response.status}: ${response.statusText} -- data: ${response.data}`
                            );
                        } else {
                            setToDeleteModalOpen(false);
                        }
                    }
                }}
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
                <StyledTable
                    checkboxes={false}
                    headers={headers}
                    toggleableHeaders={toggleableHeaders}
                    defaultShownHeaders={["item_name", ...toggleableHeaders]}
                    data={dataAndTooltips}
                    reorderable
                    filters={["item_name"]}
                    pagination={false}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    sortable={false}
                />
                <StyledAddButton onClick={() => setModal(null)}>+ Add</StyledAddButton>
            </TableDiv>
        </>
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

export default ListsDataView;
