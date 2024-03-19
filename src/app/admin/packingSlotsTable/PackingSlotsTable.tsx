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
import { logError, logInfo } from "@/logger/logger";
import { DatabaseError } from "@/app/errorClasses";

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

    useEffect(() => {
        fetchPackingSlots()
            .then((response) => setRows(response))
            .catch((error) => {
                void logError("Error fetching packing slots", error);
                throw new DatabaseError("fetch", "packing slots");
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
                async () => setRows(await fetchPackingSlots())
            )
            .subscribe((status, err) => {
                if (status === "TIMED_OUT") {
                    void logError("Channel Timed Out: Subscribe to packing_slot table", err);
                    setRows([]);
                } else if (status === "CHANNEL_ERROR") {
                    void logError("Channel Error: Subscribe to packing_slot table", err);
                    setRows([]);
                } else if (status === "CLOSED") {
                    void logInfo("Subscription to packing_slot table closed");
                } else {
                    void logInfo("Subscribed to packing_slot table");
                }
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
        setIsLoading(true);
        if (newRow.isNew) {
            insertNewPackingSlot(newRow)
                .catch((error) => void logError("Insert error with packing slot row", error))
                .finally(() => setIsLoading(false));
        } else {
            updateDbPackingSlot(newRow)
                .catch((error) => void logError("Update error with packing slot row", error))
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
            void logError("Edited row in packing slots admin table is undefined onCancelClick");
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
                .catch((error) => void logError("Update error with packing slot row order", error))
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
                .catch((error) => void logError("Update error with packing slot row order", error))
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
