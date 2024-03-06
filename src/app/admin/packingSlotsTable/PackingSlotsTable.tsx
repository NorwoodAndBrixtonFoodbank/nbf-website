"use client";

import React, { useEffect } from "react";
import { Schema } from "@/databaseUtils";
import {
    DataGrid,
    GridColDef,
    GridRowModes,
    GridRowModesModel,
    GridRowsProp,
    GridToolbarContainer,
} from "@mui/x-data-grid";
import { Switch } from "@mui/material";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

interface Props {
    packingSlotsData: Schema["packing_slots"][];
}

interface EditToolbarProps {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (newModel: (oldModel: GridRowModesModel) => GridRowModesModel) => void;
    nextId: number;
}

function EditToolbar(props: EditToolbarProps): React.JSX.Element {
    const { setRows, setRowModesModel, nextId } = props;

    const handleClick = (): void => {
        //how to pass in the next id?
        const id = nextId;
        setRows((oldRows) => [...oldRows, { id, name: "", age: "", isNew: true }]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
        }));
    };

    return (
        <GridToolbarContainer>
            <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                Add record
            </Button>
        </GridToolbarContainer>
    );
}

const PackingSlotsTable: React.FC<Props> = (props) => {
    const [rows, setRows] = React.useState(props.packingSlotsData);
    const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});

    const packingSlotsTableHeaderKeysAndLabels: GridColDef[] = [
        { field: "name", headerName: "Slot Name", flex: 1, editable: true },
        {
            field: "is_hidden",
            headerName: "Show",
            flex: 1,
            renderCell: (params) => {
                if (!params.value) {
                    return <Switch defaultChecked={true} />;
                } else {
                    return <Switch />;
                }
            },
        },
        { field: "order", headerName: "Order (Smallest number on top)", flex: 1, editable: true },
    ];

    const nextId = props.packingSlotsData.length + 1;

    return (
        <>
            <DataGrid
                rows={rows}
                columns={packingSlotsTableHeaderKeysAndLabels}
                editMode="row"
                rowModesModel={rowModesModel}
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
