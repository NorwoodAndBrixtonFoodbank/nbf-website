"use client";

import React, { useEffect } from "react";
import { Schema } from "@/databaseUtils";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Switch } from "@mui/material";

interface Props {
    packingSlotsData: Schema["packing_slots"][];
}

const PackingSlotsTable: React.FC<Props> = (props) => {
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
        { field: "order", headerName: "Order (1 is on Top)", flex: 1, editable: true },
    ];

    const initialRows = [
        {
            id: 1,
            name: "AM",
            is_hidden: false,
            order: 0,
        },
        {
            id: 2,
            name: "PM",
            is_hidden: false,
            order: 1,
        },
    ];

    useEffect(() => {
        console.log(props.packingSlotsData);
    }, []);
    return (
        <>
            <DataGrid rows={initialRows} columns={packingSlotsTableHeaderKeysAndLabels} />
        </>
    );
};

export default PackingSlotsTable;
