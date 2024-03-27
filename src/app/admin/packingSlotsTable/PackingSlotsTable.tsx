"use client";

import React, { useEffect, useState } from "react";
import supabase from "@/supabaseClient";
import {
    DataGrid,
    GridActionsCellItem,
    GridColDef,
    GridEventListener,
    GridRowEditStopReasons,
    GridRowId,
    GridRowModes,
    GridRowModesModel,
    GridRowsProp,
    GridToolbarContainer,
} from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import {
    insertNewPackingSlot,
    fetchPackingSlots,
    swapRows,
    updateDbPackingSlot,
} from "@/app/admin/packingSlotsTable/PackingSlotActions";
import { LinearProgress } from "@mui/material";
import { logErrorReturnLogId } from "@/logger/logger";
import { subscriptionStatusRequiresErrorMessage } from "@/common/subscriptionStatusRequiresErrorMessage";
import { ErrorSecondaryText } from "@/app/errorStylingandMessages";

interface EditToolbarProps {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (newModel: (oldModel: GridRowModesModel) => GridRowModesModel) => void;
    rows: PackingSlotRow[];
}

export interface PackingSlotRow {
    id: string;
    name: string;
    isShown: boolean;
    order: number;
    isNew: boolean;
}

function EditToolbar(props: EditToolbarProps): React.JSX.Element {
    const { setRows, setRowModesModel, rows } = props;

    const handleClick = (): void => {
        const id = rows.length + 1;
        setRows((oldRows) => [
            ...oldRows,
            { id, name: "", isShown: false, order: id, isNew: true },
        ]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
        }));
    };

    return (
        <GridToolbarContainer>
            <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                Add new slot
            </Button>
        </GridToolbarContainer>
    );
}

const PackingSlotsTable: React.FC = () => {
    const [rows, setRows] = useState<PackingSlotRow[]>([]);
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        setErrorMessage(null);
        fetchPackingSlots()
            .then((response) => setRows(response))
            .catch((error) => {
                void logErrorReturnLogId("Error with fetch: Packing slots", error);
                setErrorMessage("Error fetching data, please reload");
            })
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        // This requires that the DB table has Realtime turned on
        const subscriptionChannel = supabase
            .channel("packing-slot-table-changes")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "packing_slots" },
                async () => {
                    setErrorMessage(null);
                    try {
                        const packingSlots = await fetchPackingSlots();
                        setRows(packingSlots);
                    } catch (error) {
                        if (error) {
                            setRows([]);
                            void logErrorReturnLogId(
                                "Error with fetch: Packing slots subscription",
                                error
                            );
                            setErrorMessage("Error fetching data, please reload");
                        }
                    }
                }
            )
            .subscribe(async (status, error) => {
                subscriptionStatusRequiresErrorMessage(status, error, "packing_slot") &&
                    setErrorMessage("Error fetching data, please reload");
            });

        return () => {
            void supabase.removeChannel(subscriptionChannel);
        };
    }, []);

    const handleSaveClick = (id: GridRowId) => () => {
        setRowModesModel((currentValue) => ({
            ...currentValue,
            [id]: { mode: GridRowModes.View },
        }));
    };

    const processRowUpdate = (newRow: PackingSlotRow): PackingSlotRow => {
        setErrorMessage(null);
        setIsLoading(true);
        if (newRow.isNew) {
            insertNewPackingSlot(newRow)
                .catch((error) => {
                    void logErrorReturnLogId("Insert error with packing slot row", error);
                    setErrorMessage("Error inserting data, please try again");
                })
                .finally(() => setIsLoading(false));
        } else {
            updateDbPackingSlot(newRow)
                .catch((error) => {
                    void logErrorReturnLogId("Update error with packing slot row", error);
                    setErrorMessage("Error updating data, please try again");
                })
                .finally(() => setIsLoading(false));
        }
        return newRow;
    };

    const handleRowEditStop: GridEventListener<"rowEditStop"> = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            //prevents default behaviour of saving the edited state when clicking away from row being edited, force user to use save or cancel buttons
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id: GridRowId) => () => {
        setRowModesModel((currentValue) => ({
            ...currentValue,
            [id]: { mode: GridRowModes.Edit },
        }));
    };

    const handleCancelClick = (id: GridRowId) => () => {
        setRowModesModel((currentValue) => ({
            ...currentValue,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        }));

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow === undefined) {
            void logErrorReturnLogId(
                "Edited row in packing slots admin table is undefined onCancelClick"
            );
            setErrorMessage("Table error, please try again");
        } else if (editedRow.isNew) {
            setRows((currentValue) => currentValue.filter((row) => row.id !== id));
        }
    };

    const handleUpClick = (id: GridRowId, row: PackingSlotRow) => () => {
        const rowIndex = row.order - 1;
        if (rowIndex > 0) {
            setIsLoading(true);
            const rowOne = rows[rowIndex];
            const rowTwo = rows[rowIndex - 1];
            swapRows(rowOne, rowTwo)
                .catch(
                    (error) =>
                        void logErrorReturnLogId("Update error with packing slot row order", error)
                )
                .finally(() => setIsLoading(false));
        }
        setIsLoading(false);
    };

    const handleDownClick = (id: GridRowId, row: PackingSlotRow) => () => {
        const rowIndex = row.order - 1;
        if (rowIndex < rows.length - 1) {
            setIsLoading(true);
            const clickedRow = rows[rowIndex];
            const rowBelow = rows[rowIndex + 1];
            swapRows(clickedRow, rowBelow)
                .catch(
                    (error) =>
                        void logErrorReturnLogId("Update error with packing slot row order", error)
                )
                .finally(() => setIsLoading(false));
        }
    };

    const packingSlotsColumns: GridColDef[] = [
        {
            field: "order",
            type: "actions",
            headerName: "Order",
            width: 100,
            cellClassName: "actions",
            getActions: ({ id, row }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [];
                }

                if (row.order === 1) {
                    return [
                        <GridActionsCellItem
                            icon={<ArrowCircleDownIcon />}
                            label="Down"
                            onClick={handleDownClick(id, row)}
                            color="inherit"
                            key="Down"
                        />,
                    ];
                }

                if (rows && row.order === rows.length) {
                    return [
                        <GridActionsCellItem
                            icon={<ArrowCircleUpIcon />}
                            label="Up"
                            className="textPrimary"
                            onClick={handleUpClick(id, row)}
                            color="inherit"
                            key="Up"
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        icon={<ArrowCircleUpIcon />}
                        label="Up"
                        className="textPrimary"
                        onClick={handleUpClick(id, row)}
                        color="inherit"
                        key="Up"
                    />,
                    <GridActionsCellItem
                        icon={<ArrowCircleDownIcon />}
                        label="Down"
                        onClick={handleDownClick(id, row)}
                        color="inherit"
                        key="Down"
                    />,
                ];
            },
        },
        { field: "name", headerName: "Slot Name", flex: 1, editable: true },
        {
            field: "isShown",
            type: "boolean",
            headerName: "Show",
            flex: 1,
            editable: true,
        },
        {
            field: "actions",
            type: "actions",
            headerName: "Actions",
            flex: 1,
            cellClassName: "actions",
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon />}
                            label="Save"
                            sx={{
                                color: "primary.main",
                            }}
                            onClick={handleSaveClick(id)}
                            key="Save"
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                            color="inherit"
                            key="Cancel"
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(id)}
                        color="inherit"
                        key="Edit"
                    />,
                ];
            },
        },
    ];

    return (
        <>
            {errorMessage && <ErrorSecondaryText>{errorMessage}</ErrorSecondaryText>}
            {rows && (
                <DataGrid
                    rows={rows}
                    columns={packingSlotsColumns}
                    editMode="row"
                    rowModesModel={rowModesModel}
                    onRowModesModelChange={setRowModesModel}
                    onRowEditStop={handleRowEditStop}
                    processRowUpdate={processRowUpdate}
                    slots={{
                        toolbar: EditToolbar,
                        loadingOverlay: LinearProgress,
                    }}
                    slotProps={{
                        toolbar: { setRows, setRowModesModel, rows },
                    }}
                    loading={isLoading}
                />
            )}
        </>
    );
};

export default PackingSlotsTable;
