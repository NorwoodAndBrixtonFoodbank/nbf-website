import React from "react";
import getShoppingListData from "@/pdf/ShoppingList/getShoppingListData";
import PdfButton from "@/components/PdfButton/PdfButton";
import ShoppingListPdf from "@/pdf/ShoppingList/ShoppingListPdf";

interface Props {
    text: string;
    parcelIds: string[];
    onClick: () => void;
}

const ShoppingList = async ({ text, parcelIds, onClick }: Props): Promise<React.ReactElement> => {
    const data = await getShoppingListData(parcelIds);
    return (
        <PdfButton
            text={text}
            fileName="ShoppingList.pdf"
            data={data}
            pdfComponent={ShoppingListPdf}
            clickHandler={onClick}
        />
    );
};

export default ShoppingList;
