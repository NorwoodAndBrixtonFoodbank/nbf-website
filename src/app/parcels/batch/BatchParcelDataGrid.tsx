"use client";

import { Button } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useReducer } from "react";
import {
    Address,
    BatchDataRow,
    BatchTableDataState,
    CollectionInfo,
    OverrideDataRow,
} from "@/app/parcels/batch/BatchTypes";
import batchParcelsReducer from "@/app/parcels/batch/BatchParcelsReducer";
import { BooleanGroup } from "@/components/DataInput/inputHandlerFactories";

export interface BatchGridDisplayRow {
    id: number;
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
    initialTableState: BatchTableDataState;
}

const getEmptyRow = (id: number): BatchGridDisplayRow => {
    return {
        id: id,
        rowName: id,
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
    };
};

const addressToString = (address: Address | null): string | null => {
    if (!address) {
        return null;
    }
    const addressArray: string[] = [];
    for (const key in address) {
        if (address[key] !== null) {
            addressArray.push(address[key]);
        }
    }
    return addressArray.join(", ");
};

const collectionInfoToString = (collectionInfo: CollectionInfo): string => {
    const { collectionDate, collectionSlot, collectionCentreId } = collectionInfo;
    return `${collectionDate}, ${collectionSlot}, ${collectionCentreId}`;
};

const booleanGroupToString = (booleanGroup: BooleanGroup): string => {
    const trueKeys: string[] = Object.keys(booleanGroup).filter((key) => booleanGroup[key]);
    return trueKeys.join(", ");
};

const overrideDataToOverrideDisplayRow = (dataRow: OverrideDataRow): BatchGridDisplayRow => {
    if (!dataRow.data) {
        return getEmptyRow(0);
    }
    const {
        phoneNumber,
        address,
        adultInfo,
        childrenInfo,
        listType,
        dietaryRequirements,
        feminineProducts,
        babyProducts,
        nappySize,
        petFood,
        otherItems,
        deliveryInstructions,
        extraInformation,
        attentionFlag,
        signpostingCall,
        notes,
    } = dataRow.data.client;
    const { voucherNumber, packingDate, packingSlot, shippingMethod, collectionInfo } =
        dataRow.data.parcel;
    return {
        id: 0,
        rowName: 0,
        fullName: "",
        phoneNumber: phoneNumber ?? "",
        address: addressToString(address) ?? "",
        adults: adultInfo ? adultInfo.numberOfAdults : null,
        children: childrenInfo ? childrenInfo.numberOfChildren : null,
        listType: listType ?? "",
        dietaryRequirements: dietaryRequirements ? booleanGroupToString(dietaryRequirements) : "",
        feminineProducts: feminineProducts ? booleanGroupToString(feminineProducts) : "",
        babyProducts: babyProducts
            ? `Yes, Nappy Size: ${nappySize}`
            : babyProducts === false
              ? "No"
              : "",
        petFood: petFood ? booleanGroupToString(petFood) : "",
        otherItems: otherItems ? booleanGroupToString(otherItems) : "",
        deliveryInstructions: deliveryInstructions ?? "",
        extraInformation: extraInformation ?? "",
        attentionFlag: attentionFlag ? "Yes" : attentionFlag === false ? "No" : "",
        signpostingCall: signpostingCall ? "Yes" : signpostingCall === false ? "No" : "",
        notes: notes ?? "",
        voucherNumber: voucherNumber ?? "",
        packingDate: packingDate ?? "",
        packingSlot: packingSlot ?? "",
        shippingMethod: shippingMethod ?? "",
        collectionInfo: collectionInfo ? collectionInfoToString(collectionInfo) : "",
    };
};

const batchDataToBatchDisplayRow = (dataRow: BatchDataRow): BatchGridDisplayRow | null => {
    if (!dataRow.data) {
        return getEmptyRow(dataRow.id);
    }
    const {
        fullName,
        phoneNumber,
        address,
        adultInfo,
        childrenInfo,
        listType,
        dietaryRequirements,
        feminineProducts,
        babyProducts,
        nappySize,
        petFood,
        otherItems,
        deliveryInstructions,
        extraInformation,
        attentionFlag,
        signpostingCall,
        notes,
    } = dataRow.data.client;
    const {
        voucherNumber = "",
        packingDate = "",
        packingSlot = "",
        shippingMethod = "",
        collectionInfo = "",
    } = dataRow.data.parcel || {};

    return {
        id: dataRow.id,
        rowName: dataRow.id,
        fullName: fullName ?? "",
        phoneNumber: phoneNumber ?? "",
        address: addressToString(address) ?? "",
        adults: adultInfo ? adultInfo.numberOfAdults : null,
        children: childrenInfo ? childrenInfo.numberOfChildren : null,
        listType: listType ?? "",
        dietaryRequirements: dietaryRequirements ? booleanGroupToString(dietaryRequirements) : "",
        feminineProducts: feminineProducts ? booleanGroupToString(feminineProducts) : "",
        babyProducts: babyProducts
            ? `Yes, Nappy Size: ${nappySize}`
            : babyProducts === false
              ? "No"
              : "",
        petFood: petFood ? booleanGroupToString(petFood) : "",
        otherItems: otherItems ? booleanGroupToString(otherItems) : "",
        deliveryInstructions: deliveryInstructions ?? "",
        extraInformation: extraInformation ?? "",
        attentionFlag: attentionFlag ? "Yes" : attentionFlag === false ? "No" : "",
        signpostingCall: signpostingCall ? "Yes" : signpostingCall === false ? "No" : "",
        notes: notes ?? "",
        voucherNumber: voucherNumber ?? "",
        packingDate: packingDate ?? "",
        packingSlot: packingSlot ?? "",
        shippingMethod: shippingMethod ?? "",
        collectionInfo: collectionInfo ? collectionInfoToString(collectionInfo) : "",
    };
};

const tableStateToBatchDisplayRows = (tableState: BatchTableDataState): BatchGridDisplayRow[] => {
    const displayRows: BatchGridDisplayRow[] = [];
    displayRows.push(overrideDataToOverrideDisplayRow(tableState.overrideDataRow));
    tableState.batchDataRows.forEach((row) => {
        const displayRow = batchDataToBatchDisplayRow(row);
        if (displayRow) {
            displayRows.push(displayRow);
        }
    });
    return displayRows;
};

export const defaultTableState: BatchTableDataState = {
    overrideDataRow: {
        data: null,
    },
    batchDataRows: [
        {
            id: 1,
            clientId: "1",
            data: null,
        },
    ],
    clientOverrides: [],
    parcelOverrides: [],
};

const BatchParcelDataGrid: React.FC<BatchParcelDataGridProps> = ({ initialTableState }) => {
    const [tableState, _] = useReducer(batchParcelsReducer, initialTableState);

    const displayRows: BatchGridDisplayRow[] = tableStateToBatchDisplayRows(tableState);

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
