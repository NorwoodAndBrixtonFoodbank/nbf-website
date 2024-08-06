"use client";

import { Button } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React from "react";

export interface BatchGridDisplayRow {
    id: string | 0;
    rowName: number;
    fullName: string;
    phoneNumber: string;
    address: string;
    adults: number | null;
    children: number | null;
    listType: string;
    dietaryRequirements: string;
    feminineProducts: string;
    babyProducts: string;
    petFood: string;
    otherItems: string;
    deliveryInstructions: string;
    extraInformation: string;
    attentionFlag: string;
    signpostingCall: string;
    notes: string;
    voucherNumber: string;
    packingDate: string;
    packingSlot: string;
    shippingMethod: string;
    collectionInfo: string;
}

export const batchGridDisplayColumns: GridColDef<BatchGridDisplayRow[][number]>[] = [
    {
        field: "rowName",
        headerName: "Row Name",
        width: 150,
        editable: false,
        renderCell: (params) => {
            if (params.row.id === 0 && params.field === "rowName") {
                return <Button variant="contained">Apply Column</Button>;
            }
            return params.row.rowName;
        },
    },
    {
        field: "fullName",
        headerName: "Full Name",
        width: 150,
        editable: true,
    },
    {
        field: "phoneNumber",
        headerName: "Phone Number",
        width: 150,
        editable: true,
    },
    {
        field: "address",
        headerName: "Address",
        width: 200,
        editable: true,
    },
    {
        field: "adults",
        headerName: "Adults",
        type: "number",
        width: 110,
        editable: true,
    },
    {
        field: "children",
        headerName: "Children",
        type: "number",
        width: 110,
        editable: true,
    },
    {
        field: "listType",
        headerName: "List Type",
        width: 150,
        editable: true,
    },
    {
        field: "dietaryRequirements",
        headerName: "Dietary Requirements",
        width: 200,
        editable: true,
    },
    {
        field: "feminineProducts",
        headerName: "Feminine Products",
        width: 150,
        editable: true,
    },
    {
        field: "babyProducts",
        headerName: "Baby Products",
        width: 150,
        editable: true,
    },
    {
        field: "petFood",
        headerName: "Pet Food",
        width: 110,
        editable: true,
    },
    {
        field: "otherItems",
        headerName: "Other Items",
        width: 200,
        editable: true,
    },
    {
        field: "deliveryInstructions",
        headerName: "Delivery Instructions",
        width: 200,
        editable: true,
    },
    {
        field: "extraInformation",
        headerName: "Extra Information",
        width: 200,
        editable: true,
    },

    {
        field: "attentionFlag",
        headerName: "Attention Flag",
        width: 150,
        editable: true,
    },
    {
        field: "signpostingCall",
        headerName: "Signposting Call",
        width: 150,
        editable: true,
    },
    {
        field: "notes",
        headerName: "Notes",
        width: 200,
        editable: true,
    },
    {
        field: "voucherNumber",
        headerName: "Voucher Number",
        width: 150,
        editable: true,
    },
    {
        field: "packingDate",
        headerName: "Packing Date",
        width: 150,
        editable: true,
    },
    {
        field: "packingSlot",
        headerName: "Packing Slot",
        width: 150,
        editable: true,
    },
    {
        field: "shippingMethod",
        headerName: "Shipping Method",
        width: 150,
        editable: true,
    },
    {
        field: "collectionInfo",
        headerName: "Collection Info",
        width: 200,
        editable: true,
    },
];

const styledBatchGridDisplayColumns: GridColDef<BatchGridDisplayRow[][number]>[] =
    batchGridDisplayColumns.map((column) => {
        return { ...column, headerAlign: "center", align: "center" };
    });

interface BatchParcelDataGridProps {
    rows: BatchGridDisplayRow[];
}

export const defaultData: BatchGridDisplayRow[] = Array.from({ length: 2 }, (_, index) => ({
    id: crypto.randomUUID(),
    rowName: index,
    fullName: "",
    phoneNumber: "",
    address: "",
    adults: null,
    children: null,
    listType: "",
    dietaryRequirements: "",
    feminineProducts: "",
    babyProducts: "",
    petFood: "",
    otherItems: "",
    deliveryInstructions: "",
    extraInformation: "",
    attentionFlag: "",
    signpostingCall: "",
    notes: "",
    voucherNumber: "",
    packingDate: "",
    packingSlot: "",
    shippingMethod: "",
    collectionInfo: "",
}));
defaultData[0].id = 0;

const BatchParcelDataGrid: React.FC<BatchParcelDataGridProps> = ({ rows }) => {
    return (
        <DataGrid
            rows={rows}
            columns={styledBatchGridDisplayColumns}
            sx={{
                "& .MuiDataGrid-cell": {
                    border: "1px solid",
                    borderColor: "rgba(81, 81, 81, 0.5)",
                },
                "& .MuiDataGrid-columnHeaders": {
                    borderBottom: "3px solid",
                    borderTop: "2px solid",
                    borderColor: "rgba(81, 81, 81, 0.9)",
                },
                "& .MuiDataGrid-columnHeader": {
                    borderLeft: "1px solid",
                    borderRight: "1px solid",
                    borderColor: "rgba(81, 81, 81, 0.5)",
                },
                "& .MuiDataGrid-columnHeaderTitle": {
                    fontWeight: "bold",
                },
                border: "1px solid",
                borderColor: "rgba(81, 81, 81, 0.9)",
                margin: "1rem",
            }}
        />
    );
};

export default BatchParcelDataGrid;
