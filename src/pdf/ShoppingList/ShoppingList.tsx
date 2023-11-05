import React from "react";
import getShoppingListData from "@/pdf/ShoppingList/getShoppingListData";
import PdfButton from "@/components/PdfButton/PdfButton";
import ShoppingListPdf from "@/pdf/ShoppingList/ShoppingListPdf";
import { saveParcelStatus } from "@/app/parcels/ActionBar/Statuses";

interface Props {
    text: string;
    parcelIds: string[];
}

const ShoppingList = async ({ text, parcelIds }: Props): Promise<React.ReactElement> => {
    const data = await getShoppingListData(parcelIds);
    return (
        <PdfButton
            text={text}
            fileName="ShoppingList.pdf"
            data={data}
            pdfComponent={ShoppingListPdf}
            clickHandler={() => {
                try {
                    saveParcelStatus(parcelIds, "Shopping List Downloaded");
                } catch (error: any) {
                    // TODO: VFB-61: this needs to be reported to the user. Can we hook into the ActionBar.tsx setModalError()?
                }
            }}
        />
    );
};

export default ShoppingList;
