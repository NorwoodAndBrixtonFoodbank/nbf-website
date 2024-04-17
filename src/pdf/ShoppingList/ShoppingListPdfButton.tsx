"use client";

import React from "react";
import getShoppingListData, {
    ShoppingListPdfErrorType,
} from "@/pdf/ShoppingList/getShoppingListData";
import PdfButton from "@/components/PdfButton/PdfButton";
import ShoppingListPdf from "@/pdf/ShoppingList/ShoppingListPdf";
import { ParcelsTableRow } from "@/app/parcels/getParcelsTableData";
import { ShoppingListPdfData } from "./shoppingListPdfDataProps";
import { PdfDataFetchResponse } from "../common";

interface Props {
    text: string;
    parcels: ParcelsTableRow[];
    onPdfCreationCompleted: () => void;
    onPdfCreationFailed: (error: { type: ShoppingListPdfErrorType; logId: string }) => void;
}

const ShoppingListPdfButton = ({
    text,
    parcels,
    onPdfCreationCompleted,
    onPdfCreationFailed,
}: Props): React.ReactElement => {
    const fetchDataAndFileName = async (): Promise<
        PdfDataFetchResponse<ShoppingListPdfData[], ShoppingListPdfErrorType>
    > => {
        const parcelIds = parcels.map((parcel) => parcel.parcelId);
        const { data, error } = await getShoppingListData(parcelIds);
        if (error) {
            return { data: null, error: error };
        }
        return { data: { pdfData: data, fileName: "ShoppingList.pdf" }, error: null };
    };
    return (
        <PdfButton
            text={text}
            fetchDataAndFileName={fetchDataAndFileName}
            pdfComponent={ShoppingListPdf}
            onPdfCreationCompleted={onPdfCreationCompleted}
            onPdfCreationFailed={onPdfCreationFailed}
        />
    );
};

export default ShoppingListPdfButton;
