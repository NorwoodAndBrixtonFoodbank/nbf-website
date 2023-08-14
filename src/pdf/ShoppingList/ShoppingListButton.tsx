"use client";

import React from "react";
import { ShoppingListPDFProps } from "@/pdf/ShoppingList/dataPreparation";
import { NoSSR } from "next/dist/shared/lib/lazy-dynamic/dynamic-no-ssr";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ShoppingListPDF from "@/pdf/ShoppingList/ShoppingListPDF";

interface Props {
    data: ShoppingListPDFProps;
    text: string;
}

const ShoppingListButton: React.FC<Props> = ({ data, text }) => {
    return (
        <NoSSR>
            <PDFDownloadLink document={<ShoppingListPDF {...data} />} fileName="ShoppingList.pdf">
                {text}
            </PDFDownloadLink>
        </NoSSR>
    );
};

export default ShoppingListButton;
