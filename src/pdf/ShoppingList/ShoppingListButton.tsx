"use client";

import React from "react";
import { ShoppingListPDFProps } from "@/pdf/ShoppingList/dataPreparation";
import { NoSsr } from "@mui/material";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ShoppingListPDF from "@/pdf/ShoppingList/ShoppingListPDF";

interface Props {
    data: ShoppingListPDFProps;
    text: string;
}

const ShoppingListButton: React.FC<Props> = ({ data, text }) => {
    return (
        <NoSsr>
            <PDFDownloadLink document={<ShoppingListPDF {...data} />} fileName="ShoppingList.pdf">
                {text}
            </PDFDownloadLink>
        </NoSsr>
    );
};

export default ShoppingListButton;
