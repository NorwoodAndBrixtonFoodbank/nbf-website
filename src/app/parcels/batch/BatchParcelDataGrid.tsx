"use client";

import { Button } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useMemo } from "react";
import { BatchTableDataState } from "@/app/parcels/batch/BatchTypes";
import batchParcelsReducer from "@/app/parcels/batch/BatchParcelsReducer";
import { tableStateToBatchDisplayRows } from "@/app/parcels/batch/displayHelpers";
import { useLocalStorage } from "@/app/parcels/batch/useLocalStorage";

export interface BatchGridDisplayRow {
    [key: string]: string | number | null;
    id: number;
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
        field: "id",
        headerName: "Row Number",
        width: 150,
        editable: false,
        renderCell: (params) => {
            if (params.row.id === 0 && params.field === "id") {
                return <Button variant="contained">Apply Column</Button>;
            }
            return params.row.id;
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

export const defaultTableState: BatchTableDataState = {
    overrideDataRow: {
        data: null,
    },
    batchDataRows: [
        {
            id: 1,
            clientId: null,
            data: null,
        },
    ],
    clientOverrides: [],
    parcelOverrides: [],
};

const BatchParcelDataGrid: React.FC = () => {
    const [tableState, _] = useLocalStorage(batchParcelsReducer, defaultTableState);

    const displayRows = useMemo(() => {
        return tableStateToBatchDisplayRows(tableState);
    }, [tableState]);

    return (
        <DataGrid
            rows={displayRows}
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
            hideFooter
        />
    );
};

export default BatchParcelDataGrid;
