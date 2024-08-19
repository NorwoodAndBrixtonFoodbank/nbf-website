"use client";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useMemo } from "react";
import { useLocalStorage } from "@/app/parcels/batch/useLocalStorage";
import { BatchTableDataState } from "@/app/parcels/batch/BatchTypes";
import batchParcelsReducer from "@/app/parcels/batch/BatchParcelsReducer";
import { tableStateToBatchDisplayRows } from "@/app/parcels/batch/displayHelpers";
import { emptyBatchEditData, emptyOverrideData } from "@/app/parcels/batch/EmptyData";
import { DefaultTheme, useTheme } from "styled-components";
import getCenteredBatchGridDisplayColumns from "@/app/parcels/batch/getCenteredBatchGridDisplayColumns";
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
            // using sx rather than styled-components as otherwise throws an error when iterating through columns
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
