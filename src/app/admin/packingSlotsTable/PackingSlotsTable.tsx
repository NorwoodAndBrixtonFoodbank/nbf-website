"use client";

import React, { useEffect } from "react";
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
    // addPriorityPackingSlotOrder,
    createPackingSlot,
    deletePackingSlot,
    swapRows,
    updatePackingSlot,
} from "@/app/admin/packingSlotsTable/PackingSlotActions";

interface Props {
    packingSlotsData: PackingSlotRow[];
}

interface EditToolbarProps {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (newModel: (oldModel: GridRowModesModel) => GridRowModesModel) => void;
    nextId: number;
}

export interface PackingSlotRow {
    id: string;
    name: string;
    is_hidden: boolean;
    order: number;
    isNew: boolean;
}

function EditToolbar(props: EditToolbarProps): React.JSX.Element {
    const { setRows, setRowModesModel, nextId } = props;

    const handleClick = (): void => {
        const id = nextId;
        setRows((oldRows) => [
            ...oldRows,
            { id, name: "", is_hidden: false, order: id, isNew: true },
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

const PackingSlotsTable: React.FC<Props> = (props) => {
    const [rows, setRows] = React.useState(props.packingSlotsData);
    const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});

    useEffect(() => {
        console.log(rows);
    }, [rows]);
    const handleSaveClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const processRowUpdate = (newRow: PackingSlotRow): PackingSlotRow => {
        if (newRow.isNew) {
            createPackingSlot(newRow);
        } else {
            updatePackingSlot(newRow);
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
        deletePackingSlot(id);
        setRows(rows.filter((row) => row.id !== id));
    };

    const handleCancelClick = (id: GridRowId) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow!.isNew) {
            setRows(rows.filter((row) => row.id !== id));
        }
    };

    const handleUpClick = (id: GridRowId, row: PackingSlotRow) => () => {
        const rowIndex = row.order - 1;
        if (rowIndex > 0) {
            const newRowsArray = rows.toSpliced(rowIndex, 1);
            newRowsArray.splice(rowIndex - 1, 0, rows[rowIndex]);
            const row1 = rows[rowIndex];
            const row2 = rows[rowIndex - 1];
            swapRows(row1, row2);
            setRows(newRowsArray);
        }
    };

    const packingSlotsTableHeaderKeysAndLabels: GridColDef[] = [
        {
            field: "order",
            type: "actions",
            headerName: "Order",
            width: 100,
            cellClassName: "actions",
            getActions: ({ id, row }) => {
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
                        onClick={() => {}}
                        color="inherit"
                        key="Down"
                    />,
                ];
            },
        },
        { field: "name", headerName: "Slot Name", flex: 1, editable: true },
        {
            field: "is_hidden",
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

    const nextId = props.packingSlotsData.length + 1;

    return (
        <>
            <DataGrid
                rows={rows}
                columns={packingSlotsTableHeaderKeysAndLabels}
                editMode="row"
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                slots={{
                    toolbar: EditToolbar,
                }}
                slotProps={{
                    toolbar: { setRows, setRowModesModel, nextId },
                }}
            />
        </>
    );
};

export default PackingSlotsTable;
