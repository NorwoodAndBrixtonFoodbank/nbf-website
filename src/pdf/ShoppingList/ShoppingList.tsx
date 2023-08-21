import React from "react";
import prepareData from "@/pdf/ShoppingList/dataPreparation";
import PdfButton from "@/components/PdfButton/PdfButton";
import ShoppingListPDF from "@/pdf/ShoppingList/ShoppingListPDF";

interface Props {
    text: string;
    parcelId: string;
}

const ShoppingList = async ({ text, parcelId }: Props): Promise<React.ReactElement> => {
    const data = await prepareData(parcelId);
    return (
        <PdfButton
            text={text}
            fileName="ShoppingList.pdf"
            data={data}
            pdfComponent={ShoppingListPDF}
        />
    );
};

export default ShoppingList;
