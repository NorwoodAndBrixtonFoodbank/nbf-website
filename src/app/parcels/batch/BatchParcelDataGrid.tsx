"use client";

import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import React, { useMemo } from "react";
import { useLocalStorage } from "@/app/parcels/batch/useLocalStorage";
import { phoneNumberValidation } from "@/app/parcels/batch/FieldValidationFunctions";
import { Button } from "@mui/material";
import { BatchTableDataState, BatchActionType } from "@/app/parcels/batch/BatchTypes";
import batchParcelsReducer from "@/app/parcels/batch/BatchParcelsReducer";
import { tableStateToBatchDisplayRows } from "@/app/parcels/batch/displayHelpers";
import StyledBatchParcelDataGrid from "@/app/parcels/batch/StyledBatchParcelDataGrid";
import AddressEditCell from "@/app/parcels/batch/AddressEditCell";
import { ADDRESS_WIDTH } from "@/app/parcels/batch/ColumnWidths";
import { emptyBatchEditData, emptyOverrideData } from "@/app/parcels/batch/EmptyData";
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

export const getBatchGridDisplayColumns = (
    tableState: BatchTableDataState,
    dispatch: React.Dispatch<BatchActionType>
): GridColDef[] => {
    console.log("table state", tableState);
    return [
        {
            field: "id",
            headerName: "Row Number",
            width: 150,
            editable: false,
            renderCell: (gridRenderCellParams) => {
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
};

const getCenteredBatchGridDisplayColumns = (
    tableState: BatchTableDataState,
    dispatch: React.Dispatch<BatchActionType>
): GridColDef[] => {
    const batchGridDisplayColumns: GridColDef[] = getBatchGridDisplayColumns(tableState, dispatch);
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
    const styledBatchGridDisplayColumns: GridColDef[] = getCenteredBatchGridDisplayColumns(
        tableState,
        dispatch
    );
    // console.log(styledBatchGridDisplayColumns);
    return (
        <StyledBatchParcelDataGrid
            rows={displayRows}
            columns={styledBatchGridDisplayColumns}
            hideFooter
        />
    );
};

export default BatchParcelDataGrid;
