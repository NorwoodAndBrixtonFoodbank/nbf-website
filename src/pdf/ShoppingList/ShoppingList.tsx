import React from "react";
import getShoppingListData from "@/pdf/ShoppingList/getShoppingListData";
import PdfButton from "@/components/PdfButton/PdfButton";
import ShoppingListPdf from "@/pdf/ShoppingList/ShoppingListPdf";

interface Props {
    text: string;
    parcelId: string;
}

const ShoppingList = async ({ text, parcelId }: Props): Promise<React.ReactElement> => {
    const data = await getShoppingListData(parcelId);
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
