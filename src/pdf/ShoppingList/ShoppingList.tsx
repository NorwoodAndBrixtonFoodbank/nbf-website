"use client";

import React, { useEffect, useState } from "react";
import getShoppingListData from "@/pdf/ShoppingList/getShoppingListData";
import PdfButton from "@/components/PdfButton/PdfButton";
import ShoppingListPdf from "@/pdf/ShoppingList/ShoppingListPdf";
import { ShoppingListPdfDataProps } from "@/pdf/ShoppingList/shoppingListPdfDataProps";

interface Props {
    text: string;
    parcelId: string;
}

const ShoppingList = ({ text, parcelId }: Props): React.ReactElement => {
    const [data, setData] = useState<ShoppingListPdfDataProps | null>(null);

    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            const preparedData = await getShoppingListData(parcelId);
            setData(preparedData);
        };

        fetchData();
    }, [parcelId]);

    if (data === null) {
        return <></>;
    }

    return (
        <PdfButton
            text={text}
            fileName="ShoppingList.pdf"
            data={data}
            pdfComponent={ShoppingListPdf}
        />
    );
};

export default ShoppingList;
