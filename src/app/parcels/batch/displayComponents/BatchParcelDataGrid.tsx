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
import submitBatchTableData, {
    AddBatchRowError,
    filterUnsubmittedRows,
} from "@/app/parcels/batch/submitTableData";
import { batchSubmitTestData } from "@/app/parcels/batch/mockData";
import { verifyBatchTableData } from "@/app/parcels/batch/verifyTableData";

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

const countErrorTypes = (errors: AddBatchRowError[]): Record<string, number> => {
    return errors.reduce(
        (acc, rowError) => {
            acc[rowError.displayMessage] = (acc[rowError.displayMessage] || 0) + 1;
            return acc;
        },
        {} as Record<string, number>
    );
};

const BatchParcelDataGrid: React.FC = () => {
    const [tableState, dispatch] = useLocalStorage(batchParcelsReducer, defaultTableState);
    const [isConfirmationDialogVisible, setIsConfirmationDialogVisible] = useState(false);
    const [isSuccessDialogVisible, setIsSuccessDialogVisible] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");
    const [confirmationErrors, setConfirmationErrors] = useState<AddBatchRowError[]>([]);
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

    const handleVerification = async (): Promise<void> => {
        const confirmationErrors = await verifyBatchTableData(tableState);
        setConfirmationErrors(confirmationErrors);
        setIsConfirmationDialogVisible(true);
    };

    const handleSubmit = async (): Promise<void> => {
        const { submitErrors } = await submitBatchTableData(tableState);
        setSubmitErrors(submitErrors);

        // comments will be updated and changed to be more specific in the next PR
        if (submitErrors.length == 0) {
            // setDialogMessage(`Successfully submitted ${tableState.batchDataRows.length} row(s)`);
            setDialogMessage("Successfully submitted these rows");
            handleReset();
        } else {
            // setDialogMessage(`There were ${submitErrors.length} error(s) encountered during submission.`);
            setDialogMessage("Errors encountered during submission.");
            handleUnsubmittedRows(submitErrors);
        }

        setIsConfirmationDialogVisible(false);
        setIsSuccessDialogVisible(true);
    };

    const handleReset = (): void => {
        setConfirmationErrors([]);
        setSubmitErrors([]);
        dispatch({
            type: "initialise_table_state",
            payload: { initialTableState: defaultTableState },
        });
    };

    const handleUnsubmittedRows = (submitErrors: AddBatchRowError[]): void => {
        const newState = filterUnsubmittedRows(tableState, submitErrors);
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
                onClick={handleVerification}
                variant="contained"
                sx={{ marginLeft: "1rem", minWidth: "120px" }}
            >
                Submit Data
            </Button>

            <Button
                onClick={() => dispatch({ type: "add_row" })}
                variant="contained"
                sx={{ marginLeft: "1rem", minWidth: "120px" }}
            >
                Add new row
            </Button>

            <Dialog
                open={isConfirmationDialogVisible}
                sx={{
                    "& .MuiDialog-paper": {
                        padding: "1rem",
                        borderRadius: "15px",
                        boxShadow: "0 3px 5px rgba(0,0,0,0.8)",
                        margin: "auto",
                        borderColor: confirmationErrors.length == 0 ? "#a8d49c" : "#990f0f",
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
                    Are you sure you want to submit these rows?
                </DialogTitle>

                {confirmationErrors.length !== 0 && (
                    <DialogContent>
                        <ul>
                            {Object.entries(countErrorTypes(confirmationErrors)).map(
                                ([errorType, count]) => (
                                    <li key={errorType}>
                                        {errorType}: {count} row(s)
                                    </li>
                                )
                            )}
                        </ul>
                    </DialogContent>
                )}
                <DialogActions sx={{ justifyContent: "center" }}>
                    <>
                        <Button
                            variant="contained"
                            sx={{ margin: "1rem", minWidth: "120px" }}
                            onClick={() => {
                                setIsConfirmationDialogVisible(false);
                            }}
                        >
                            Close
                        </Button>
                        {confirmationErrors.length == 0 && (
                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                                sx={{ margin: "1rem", minWidth: "120px" }}
                            >
                                Submit
                            </Button>
                        )}
                    </>
                </DialogActions>
            </Dialog>

            <Dialog
                open={isSuccessDialogVisible}
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
                {submitErrors.length > 0 && (
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
                                    setIsSuccessDialogVisible(false);
                                }}
                            >
                                Reset rows and start again
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => setIsSuccessDialogVisible(false)}
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
                                onClick={() => setIsSuccessDialogVisible(false)}
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
