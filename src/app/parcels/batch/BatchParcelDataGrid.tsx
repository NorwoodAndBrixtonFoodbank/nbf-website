"use client";

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Modal } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useMemo, useState } from "react";
import { BatchTableDataState } from "@/app/parcels/batch/BatchTypes";
import batchParcelsReducer from "@/app/parcels/batch/BatchParcelsReducer";
import { tableStateToBatchDisplayRows } from "@/app/parcels/batch/displayHelpers";
import { useLocalStorage, writeLocalTableState } from "@/app/parcels/batch/useLocalStorage";
import submitBatchTableData, { AddBatchError, resetBatchTableData } from "./submitTableData";
import { batchSubmitTestData } from "./mockData";
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
    const [tableState, dispatch] = useLocalStorage(batchParcelsReducer, defaultTableState);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");
    const [errors, setErrors] = useState<AddBatchError[]>([]);
    const router = useRouter();

    writeLocalTableState(batchSubmitTestData);

    const displayRows = useMemo(() => {
        return tableStateToBatchDisplayRows(tableState);
    }, [tableState]);

    const handleSubmit = async () : Promise<void> => {
        // const errors = await submitBatchTableData(tableState);
        // setErrors(errors);
        // dispatch({ type: "initialise_table_state", payload: { initialTableState: resettedState } });

        if (errors.length == 0) {
            setDialogMessage(`Successfully submitted ${tableState.batchDataRows.length} row(s)`);
        } else {
            setDialogMessage("Errors encountered during submission. Please review the errors");
        }

        setDialogVisible(true);
    };

    const handleReset = () => {
        const newState = resetBatchTableData(tableState, errors);
        dispatch({ type: "initialise_table_state", payload: { initialTableState: newState } });
        setDialogVisible(false);
    };

    const handleReturnToParcels = () => {
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
                onClose={handleReset}
                sx={{
                    "& .MuiDialog-paper": {
                        padding: "1rem",
                        borderRadius: "15px",
                        boxShadow: "0 3px 5px rgba(0,0,0,0.8)",
                        margin: "auto",
                        borderColor: errors.length == 0 ? "#a8d49c" : "ff0000",
                        borderWidth: "1px", 
                        borderStyle: "solid",
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        fontSize: "1.2rem",
                        fontWeight: "bold",
                        textAlign: "center",
                        color: "#a8d49c",
                    }}
                >
                    {dialogMessage}
                </DialogTitle>
                {/* <DialogContent>
                    
                </DialogContent> */}
                <DialogActions>
                    {errors.length > 0 ? (
                        <>
                            <ul>
                                {errors.map((error) => {
                                    return (
                                        <li key={error.rowId}>
                                            Error on row {error.rowId}: {error.error.type}
                                        </li>
                                    );
                                })}
                            </ul>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    setDialogVisible(false);
                                    handleReset();
                                }}
                            >
                                Close
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                variant="contained"
                                sx={{ margin: "1rem", minWidth: "120px" }}
                                onClick={handleReset}
                            >
                                Reset and Add More
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
                    {/* <Button onClick={() => setDialogVisible(false)}>Close</Button> */}
                </DialogActions>
            </Dialog>
        </>
    );
};

export default BatchParcelDataGrid;
