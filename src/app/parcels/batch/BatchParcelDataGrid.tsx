"use client";

import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useMemo } from "react";
import { BatchTableDataState } from "@/app/parcels/batch/batchTypes";
import batchParcelsReducer from "@/app/parcels/batch/batchParcelsReducer";
import { tableStateToBatchDisplayRows } from "@/app/parcels/batch/displayHelpers";
import { useLocalStorage } from "@/app/parcels/batch/useLocalStorage";
import submitBatchTableData, { AddBatchRowError, displayUnsubmittedRows } from "./submitTableData";
import { batchSubmitTestData } from "./mockData";
import { emptyOverrideData, emptyBatchEditData } from "./emptyData";
import { useRouter } from "next/navigation";

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
                return (
                    <Button variant="contained" sx={{ minWidth: "120px" }}>
                        Apply Column
                    </Button>
                );
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

    const displayRows = useMemo(() => {
        return tableStateToBatchDisplayRows(tableState);
    }, [tableState]);

    const handleSubmit = async (): Promise<void> => {
        const { errors: submitErrors } = await submitBatchTableData(tableState);
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
