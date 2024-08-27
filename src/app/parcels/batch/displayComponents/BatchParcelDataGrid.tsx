"use client";

import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useMemo, useState } from "react";
import { useLocalStorage, writeLocalTableState } from "@/app/parcels/batch/useLocalStorage";
import { BatchTableDataState } from "@/app/parcels/batch/batchTypes";
import batchParcelsReducer from "@/app/parcels/batch/batchParcelsReducer";
import { tableStateToBatchDisplayRows } from "@/app/parcels/batch/displayHelpers";
import { emptyBatchEditData, emptyOverrideData } from "@/app/parcels/batch/emptyData";
import { DefaultTheme, useTheme } from "styled-components";
import getCenteredBatchGridDisplayColumns from "@/app/parcels/batch/getCenteredBatchGridDisplayColumns";
import { useRouter } from "next/navigation";
import submitBatchTableData, { AddBatchRowError, displayUnsubmittedRows } from "@/app/parcels/batch/submitTableData";
import { batchSubmitTestData, mockTableDataState } from "../mockData";
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
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");
    const [submitErrors, setSubmitErrors] = useState<AddBatchRowError[]>([]);
    const router = useRouter();

    writeLocalTableState(batchSubmitTestData);

    const displayRows = useMemo(() => {
        return tableStateToBatchDisplayRows(tableState);
    }, [tableState]);

    const theme: DefaultTheme = useTheme();
    const [isRowCollection, setIsRowCollection] = useState<{ [key: number]: boolean }>({});
    const centeredBatchGridDisplayColumns: GridColDef[] = getCenteredBatchGridDisplayColumns(
        tableState,
        dispatch,
        isRowCollection,
        setIsRowCollection
    );

    const handleSubmit = async (): Promise<void> => {
        console.log(tableState.batchDataRows)
        const { errors: submitErrors } = await submitBatchTableData(tableState);
        console.log(submitErrors)
        setSubmitErrors(submitErrors);

        if (submitErrors.length == 0) {
            setDialogMessage(`Successfully submitted ${tableState.batchDataRows.length} row(s)`);
            handleReset();
        } else {
            setDialogMessage(
                `There were ${submitErrors.length} error(s) encountered during submission.`
            );
            handleUnsubmittedRows(submitErrors);
        }

        setDialogVisible(true);
    };

    const handleReset = (): void => {
        dispatch({
            type: "initialise_table_state",
            payload: { initialTableState: defaultTableState },
        });
    };

    const handleUnsubmittedRows = (submitErrors: AddBatchRowError[]): void => {
        const newState = displayUnsubmittedRows(tableState, submitErrors);
        dispatch({ type: "initialise_table_state", payload: { initialTableState: newState } });
    };

    const handleReturnToParcels = (): void => {
        router.push("/parcels");
    };

    return (
        <>
            <DataGrid
                rows={displayRows}
                columns={centeredBatchGridDisplayColumns}
                // only dispatches if a validated string field is updated
                processRowUpdate={(newRow: BatchGridDisplayRow, oldRow: BatchGridDisplayRow) => {
                    if (newRow.fullName !== oldRow.fullName) {
                        dispatch({
                            type: "update_cell",
                            updateCellPayload: {
                                rowId: newRow.id,
                                newValueAndFieldName: {
                                    type: "client",
                                    newValue: newRow.fullName,
                                    fieldName: "fullName",
                                },
                            },
                        });
                    }
                    if (newRow.voucherNumber !== oldRow.voucherNumber) {
                        dispatch({
                            type: "update_cell",
                            updateCellPayload: {
                                rowId: newRow.id,
                                newValueAndFieldName: {
                                    type: "parcel",
                                    newValue: newRow.voucherNumber,
                                    fieldName: "voucherNumber",
                                },
                            },
                        });
                    }
                    return newRow;
                }}
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
            <Button
                onClick={handleSubmit}
                variant="contained"
                sx={{ marginLeft: "1rem", minWidth: "120px" }}
            >
                Submit
            </Button>
            <Dialog
                open={dialogVisible}
                sx={{
                    "& .MuiDialog-paper": {
                        padding: "1rem",
                        borderRadius: "15px",
                        boxShadow: "0 3px 5px rgba(0,0,0,0.8)",
                        margin: "auto",
                        borderColor: submitErrors.length == 0 ? "#a8d49c" : "#990f0f",
                        borderWidth: "1px",
                        borderStyle: "solid",
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        fontSize: "1.2rem",
                        textAlign: "center",
                    }}
                >
                    {dialogMessage}
                </DialogTitle>
                {submitErrors.length !== 0 && (
                    <DialogContent sx={{ textAlign: "center" }}>
                        An unexpected error occurred and some rows did not submit.
                        <br />
                        Please try submitting again.
                    </DialogContent>
                )}
                <DialogActions sx={{ justifyContent: "center" }}>
                    {submitErrors.length > 0 ? (
                        <>
                            <Button
                                variant="contained"
                                sx={{ margin: "1rem", minWidth: "120px" }}
                                onClick={() => {
                                    handleReset();
                                    setDialogVisible(false);
                                }}
                            >
                                Reset rows and start again
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => setDialogVisible(false)}
                                sx={{ margin: "1rem", minWidth: "120px" }}
                            >
                                View unsubmitted rows
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                variant="contained"
                                sx={{ margin: "1rem", minWidth: "120px" }}
                                onClick={() => setDialogVisible(false)}
                            >
                                Add more rows
                            </Button>
                            <Button
                                variant="contained"
                                sx={{ margin: "1rem", minWidth: "120px" }}
                                onClick={handleReturnToParcels}
                            >
                                Return to the Parcels Page
                            </Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>
        </>
    );
};

export default BatchParcelDataGrid;
