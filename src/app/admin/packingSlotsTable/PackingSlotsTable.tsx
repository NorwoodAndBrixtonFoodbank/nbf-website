"use client";

import React from "react";
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
import {
    createPackingSlot,
    updatePackingSlot,
} from "@/app/admin/packingSlotsTable/PackingSlotActions";

interface Props {
    packingSlotsData: Row[];
}

interface EditToolbarProps {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (newModel: (oldModel: GridRowModesModel) => GridRowModesModel) => void;
    nextId: number;
}

interface Row {
    id: number;
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

    const handleSaveClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const processRowUpdate = (newRow: Row): Row => {
        if (newRow.isNew) {
            createPackingSlot(newRow);
        } else if (newRow.isNew === undefined) {
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

    const packingSlotsTableHeaderKeysAndLabels: GridColDef[] = [
        { field: "name", headerName: "Slot Name", flex: 1, editable: true },
        {
            field: "is_hidden",
            type: "boolean",
            headerName: "Show",
            flex: 1,
            editable: true,
        },
        {
            field: "order",
            type: "number",
            headerName: "Order (Smallest number on top)",
            flex: 1,
            editable: true,
        },
        {
            field: "actions",
            type: "actions",
            headerName: "Actions",
            width: 100,
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
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={() => {}}
                            color="inherit"
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
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={() => {}}
                        color="inherit"
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
