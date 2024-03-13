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
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import {
    createPackingSlot,
    deletePackingSlot,
    fetchPackingSlots,
    swapRows,
    updatePackingSlot,
} from "@/app/admin/packingSlotsTable/PackingSlotActions";
import { LinearProgress } from "@mui/material";

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
    const [rows, setRows] = useState<PackingSlotRow[] | null>(null);
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
    const [isLoading, setIsLoading] = useState<boolean>(true);

    async function getPackingSlots(): Promise<void> {
        await fetchPackingSlots()
            .then((response) => setRows(response))
            .catch((error) => console.log(error))
            .finally(() => setIsLoading(false));
    }
    useEffect(() => {
        getPackingSlots();
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
            .subscribe();

        return () => {
            supabase.removeChannel(subscriptionChannel);
        };
    }, []);

    const handleSaveClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const processRowUpdate = (newRow: PackingSlotRow): PackingSlotRow => {
        setIsLoading(true);
        if (newRow.isNew) {
            createPackingSlot(newRow)
                .catch((error) => console.log(error))
                .finally(() => setIsLoading(false));
        } else {
            updatePackingSlot(newRow)
                .catch((error) => console.log(error))
                .finally(() => setIsLoading(false));
        }
        return newRow;
    };

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel): void => {
        setRowModesModel(newRowModesModel);
    };

    const handleRowEditStop: GridEventListener<"rowEditStop"> = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleDeleteClick = (id: GridRowId) => () => {
        setIsLoading(true);
        deletePackingSlot(id)
            .catch((error) => console.log(error))
            .finally(() => setIsLoading(false));
    };

    const handleCancelClick = (id: GridRowId) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        if (rows) {
            const editedRow = rows.find((row) => row.id === id);
            if (editedRow!.isNew) {
                setRows(rows.filter((row) => row.id !== id));
            }
        }
    };

    const handleUpClick = (id: GridRowId, row: PackingSlotRow) => () => {
        const rowIndex = row.order - 1;
        if (rowIndex > 0) {
            if (rows) {
                setIsLoading(true);
                const rowOne = rows[rowIndex];
                const rowTwo = rows[rowIndex - 1];
                swapRows(rowOne, rowTwo)
                    .catch((error) => console.log(error))
                    .finally(() => setIsLoading(false));
            }
        }
        setIsLoading(false);
    };

    const handleDownClick = (id: GridRowId, row: PackingSlotRow) => () => {
        const rowIndex = row.order - 1;
        if (rows) {
            if (rowIndex < rows.length - 1) {
                setIsLoading(true);
                const clickedRow = rows[rowIndex];
                const rowBelow = rows[rowIndex + 1];
                swapRows(clickedRow, rowBelow)
                    .catch((error) => console.log(error))
                    .finally(() => setIsLoading(false));
            }
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
                } else if (rows && row.order === rows.length) {
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
                } else {
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
                }
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
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                        key="Delete"
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
                    onRowModesModelChange={handleRowModesModelChange}
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
