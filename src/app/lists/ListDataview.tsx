"use client";

import { DatabaseError } from "@/app/errorClasses";
import Table, { ColumnDisplayFunctions, ColumnStyles } from "@/components/Tables/Table";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import EditModal, { EditModalState } from "@/app/lists/EditModal";
import supabase from "@/supabaseClient";
import { Schema } from "@/databaseUtils";
import ConfirmDialog from "@/components/Modal/ConfirmDialog";
import Snackbar from "@mui/material/Snackbar/Snackbar";
import Alert from "@mui/material/Alert/Alert";
import Button from "@mui/material/Button";
import TooltipCell from "@/app/lists/TooltipCell";
import TableSurface from "@/components/Tables/TableSurface";
import CommentBox from "@/app/lists/CommentBox";
import { buildTextFilter, filterRowByText } from "@/components/Tables/TextFilter";
import { Filter, PaginationType } from "@/components/Tables/Filters";

export interface ListRow {
    primaryKey: string;
    rowOrder: number;
    itemName: string;
    "1": QuantityAndNotes;
    "2": QuantityAndNotes;
    "3": QuantityAndNotes;
    "4": QuantityAndNotes;
    "5": QuantityAndNotes;
    "6": QuantityAndNotes;
    "7": QuantityAndNotes;
    "8": QuantityAndNotes;
    "9": QuantityAndNotes;
    "10": QuantityAndNotes;
}

export interface QuantityAndNotes {
    quantity: string;
    notes: string | null;
}

interface ListDataViewProps {
    listOfIngridients: ListRow[];
    setListOfIngridients: React.Dispatch<React.SetStateAction<ListRow[]>>;
    comment: string;
}

export const listsHeaderKeysAndLabels = [
    ["itemName", "Description"],
    ["1", "Single"],
    ["2", "Family of 2"],
    ["3", "Family of 3"],
    ["4", "Family of 4"],
    ["5", "Family of 5"],
    ["6", "Family of 6"],
    ["7", "Family of 7"],
    ["8", "Family of 8"],
    ["9", "Family of 9"],
    ["10", "Family of 10"],
] satisfies [keyof ListRow, string][];

export const listRowToListDB = (listRow: Partial<ListRow>): Partial<Schema["lists"]> => ({
    item_name: listRow.itemName,
    notes_for_1: listRow[1]?.notes,
    notes_for_2: listRow[2]?.notes,
    notes_for_3: listRow[3]?.notes,
    notes_for_4: listRow[4]?.notes,
    notes_for_5: listRow[5]?.notes,
    notes_for_6: listRow[6]?.notes,
    notes_for_7: listRow[7]?.notes,
    notes_for_8: listRow[8]?.notes,
    notes_for_9: listRow[9]?.notes,
    notes_for_10: listRow[10]?.notes,
    quantity_for_1: listRow[1]?.quantity,
    quantity_for_2: listRow[2]?.quantity,
    quantity_for_3: listRow[3]?.quantity,
    quantity_for_4: listRow[4]?.quantity,
    quantity_for_5: listRow[5]?.quantity,
    quantity_for_6: listRow[6]?.quantity,
    quantity_for_7: listRow[7]?.quantity,
    quantity_for_8: listRow[8]?.quantity,
    quantity_for_9: listRow[9]?.quantity,
    quantity_for_10: listRow[10]?.quantity,
    primary_key: listRow.primaryKey,
    row_order: listRow.rowOrder,
});

const displayQuantityAndNotes = (data: QuantityAndNotes): React.ReactElement => {
    return <TooltipCell cellValue={data.quantity} tooltipValue={data.notes ?? ""} />;
};

const listDataViewColumnDisplayFunctions = {
    ...Object.fromEntries(
        listsHeaderKeysAndLabels.slice(1).map(([key]) => [key, displayQuantityAndNotes])
    ),
} satisfies ColumnDisplayFunctions<ListRow>;

const listsColumnStyleOptions: ColumnStyles<ListRow> = {
    itemName: {
        minWidth: "8rem",
    },
    ...Object.fromEntries(
        listsHeaderKeysAndLabels.slice(1).map(([key]) => [
            key,
            {
                minWidth: "10rem",
                center: true,
            },
        ])
    ),
};

const ListsDataView: React.FC<ListDataViewProps> = ({
    listOfIngridients,
    setListOfIngridients: setListOfIngridients,
    comment,
}) => {
    const [modal, setModal] = useState<EditModalState>();
    const [toDelete, setToDelete] = useState<number | null>(null);
    // need another setState otherwise the modal content changes before the close animation finishes
    const [toDeleteModalOpen, setToDeleteModalOpen] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    if (listOfIngridients === null) {
        throw new Error("No data found");
    }

    const toggleableHeaders = listsHeaderKeysAndLabels.map(([key]) => key);

    const onEdit = (index: number): void => {
        setModal(listRowToListDB(listOfIngridients[index]));
    };

    const reorderRows = (row1: ListRow, row2: ListRow): void => {
        const primaryKeys = listOfIngridients.map(
            (listOfIngridients) => listOfIngridients.primaryKey
        );

        const row1Index = primaryKeys.indexOf(row1.primaryKey);
        const row2Index = primaryKeys.indexOf(row2.primaryKey);

        const row1Item = listOfIngridients[row1Index];
        const row1Order = row1Item.rowOrder;

        const row2Item = listOfIngridients[row2Index];
        const row2Order = row2Item.rowOrder;

        row1Item.rowOrder = row2Order;
        row2Item.rowOrder = row1Order;

        const newListOfIngridients = [...listOfIngridients];

        newListOfIngridients[row1Index] = row2Item;
        newListOfIngridients[row2Index] = row1Item;

        setListOfIngridients(newListOfIngridients);
    };
    const onSwapRows = async (row1: ListRow, row2: ListRow): Promise<void> => {
        const { error } = await supabase.from("lists").upsert([
            {
                primary_key: row1.primaryKey,
                row_order: row2.rowOrder,
            },
            {
                primary_key: row2.primaryKey,
                row_order: row1.rowOrder,
            },
        ]);

        if (error) {
            throw new DatabaseError("update", "lists items");
        }

        reorderRows(row1, row2);
    };

    const onDeleteButtonClick = (index: number): void => {
        setToDelete(index);
        setToDeleteModalOpen(true);
    };

    const onConfirmDeletion = async (): Promise<void> => {
        if (toDelete !== null) {
            const itemToDelete = listOfIngridients[toDelete];
            const { error } = await supabase
                .from("lists")
                .delete()
                .eq("primary_key", itemToDelete.primaryKey);

            if (error) {
                setErrorMsg(error.message);
            } else {
                window.location.reload();
            }
        }
    };

    const [listData, setListData] = useState<ListRow[]>(listOfIngridients);

    const filters: Filter<ListRow, string>[] = [
        buildTextFilter({
            key: "itemName",
            label: "Item",
            headers: listsHeaderKeysAndLabels,
            methodConfig: { methodType: PaginationType.Client, method: filterRowByText },
        }),
    ];
    const [primaryFilters, setPrimaryFilters] = useState<Filter<ListRow, string>[]>(filters);

    useEffect(() => {
        setListData(
            listOfIngridients.filter((row) => {
                return primaryFilters.every((filter) => {
                    if (filter.methodConfig.methodType === PaginationType.Client) {
                        return filter.methodConfig.method(row, filter.state, filter.key);
                    }
                    return false;
                });
            })
        );
    }, [primaryFilters, listOfIngridients]);

    return (
        <>
            <ConfirmDialog
                message={`Are you sure you want to delete ${
                    toDelete ? listOfIngridients[toDelete].itemName : ""
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
                <CommentBox originalComment={comment} />
                <Table<ListRow>
                    headerKeysAndLabels={listsHeaderKeysAndLabels}
                    toggleableHeaders={toggleableHeaders}
                    dataPortion={listData}
                    columnDisplayFunctions={listDataViewColumnDisplayFunctions}
                    columnStyleOptions={listsColumnStyleOptions}
                    checkboxConfig={{ displayed: false }}
                    paginationConfig={{ pagination: false }}
                    sortConfig={{ sortPossible: false }}
                    editableConfig={{
                        editable: true,
                        onEdit: onEdit,
                        onDelete: onDeleteButtonClick,
                        onSwapRows: onSwapRows,
                        setDataPortion: setListData,
                    }}
                    filterConfig={{
                        primaryFiltersShown: true,
                        primaryFilters: primaryFilters,
                        setPrimaryFilters: setPrimaryFilters,
                        additionalFiltersShown: false,
                    }}
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
