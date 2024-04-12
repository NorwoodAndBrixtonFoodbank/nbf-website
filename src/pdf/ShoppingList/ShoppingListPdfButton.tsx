"use client";

import React from "react";
import getShoppingListData from "@/pdf/ShoppingList/getShoppingListData";
import PdfButton from "@/components/PdfButton/PdfButton";
import ShoppingListPdf from "@/pdf/ShoppingList/ShoppingListPdf";
import { ParcelsTableRow } from "@/app/parcels/getParcelsTableData";
import { ShoppingListPdfDataList } from "./shoppingListPdfDataProps";

interface Props {
    text: string;
    parcels: ParcelsTableRow[];
    onClick: () => void;
}

const ShoppingListPdfButton = ({ text, parcels, onClick }: Props): React.ReactElement => {
    const fetchDataAndFileName = async (): Promise<{
        data: ShoppingListPdfDataList;
        fileName: string;
    }> => {
        const parcelIds = parcels.map((parcel) => parcel.parcelId);
        const data = await getShoppingListData(parcelIds);
        return { data: data, fileName: "ShoppingList.pdf" };
    };
    return (
        <PdfButton
            text={text}
            fetchDataAndFileName={fetchDataAndFileName}
            pdfComponent={ShoppingListPdf}
            clickHandler={onClick}
        />
    );
};

export default ShoppingListPdfButton;
