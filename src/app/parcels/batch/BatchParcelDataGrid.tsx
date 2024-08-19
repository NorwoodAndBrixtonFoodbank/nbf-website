"use client";

import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import React, { useMemo } from "react";
import { useLocalStorage } from "@/app/parcels/batch/useLocalStorage";
import { phoneNumberValidation } from "@/app/parcels/batch/FieldValidationFunctions";
import { Button } from "@mui/material";
import { BatchTableDataState, BatchActionType } from "@/app/parcels/batch/BatchTypes";
import batchParcelsReducer from "@/app/parcels/batch/BatchParcelsReducer";
import { tableStateToBatchDisplayRows } from "@/app/parcels/batch/displayHelpers";
import AddressEditCell from "@/app/parcels/batch/AddressEditCell";
import { ADDRESS_WIDTH } from "@/app/parcels/batch/ColumnWidths";
import { emptyBatchEditData, emptyOverrideData } from "@/app/parcels/batch/EmptyData";
import { DefaultTheme, useTheme } from "styled-components";
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

export const getCenteredBatchGridDisplayColumns = (
    tableState: BatchTableDataState,
    dispatch: React.Dispatch<BatchActionType>
): GridColDef[] => {
    const batchGridDisplayColumns = [
        {
            field: "id",
            headerName: "Row Number",
            width: 150,
            editable: false,
            renderCell: (gridRenderCellParams: GridRenderCellParams) => {
                if (gridRenderCellParams.row.id === 0 && gridRenderCellParams.field === "id") {
                    return <Button variant="contained">Apply Column</Button>;
                }
                return gridRenderCellParams.row.id;
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
            preProcessEditCellProps: phoneNumberValidation,
        },
        {
            field: "address",
            headerName: "Address",
            type: "string",
            width: ADDRESS_WIDTH,
            editable: true,
            renderEditCell: (gridRenderCellParams: GridRenderCellParams): React.ReactNode => {
                return (
                    <AddressEditCell
                        gridRenderCellParams={gridRenderCellParams}
                        tableState={tableState}
                        dispatchBatchTableAction={dispatch}
                    />
                );
            },
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
    return batchGridDisplayColumns.map((column) => {
        return { ...column, headerAlign: "center", align: "center" };
    });
};

export const defaultTableState: BatchTableDataState = {
    overrideDataRow: {
        data: emptyOverrideData,
    },
    batchDataRows: [
        {
            id: 1,
            clientId: null,
            data: emptyBatchEditData,
        },
    ],
    clientOverrides: [],
    parcelOverrides: [],
};

const BatchParcelDataGrid: React.FC = () => {
    const [tableState, dispatch] = useLocalStorage(batchParcelsReducer, defaultTableState);
    const displayRows = useMemo(() => {
        return tableStateToBatchDisplayRows(tableState);
    }, [tableState]);
    const theme: DefaultTheme = useTheme();
    const centeredBatchGridDisplayColumns: GridColDef[] = getCenteredBatchGridDisplayColumns(
        tableState,
        dispatch
    );
    return (
        <DataGrid
            rows={displayRows}
            columns={centeredBatchGridDisplayColumns}
            sx={{
                "& .MuiDataGrid-cell": {
                    border: "1px solid",
                    borderColor: `${theme.main.border}`,
                    "& .MuiInputBase-root": {
                        height: "100%",
                    },
                },
                "& .MuiDataGrid-columnHeaders": {
                    borderBottom: "3px solid",
                    borderTop: "2px solid",
                    borderColor: `${theme.main.border}`,
                },
                "& .MuiDataGrid-columnHeader": {
                    borderLeft: "1px solid",
                    borderRight: "1px solid",
                    borderColor: `${theme.main.border}`,
                },
                "& .MuiDataGrid-columnHeaderTitle": {
                    fontWeight: "bold",
                },
                "& .Mui-error": {
                    backgroundColor: `${theme.error}`,
                    color: `${theme.text}`,
                },
                border: "1px solid",
                borderColor: `${theme.main.border}`,
                margin: "1rem",
            }}
            hideFooter
        />
    );
};

export default BatchParcelDataGrid;
