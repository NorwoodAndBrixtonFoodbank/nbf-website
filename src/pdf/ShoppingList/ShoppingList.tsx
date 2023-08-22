import React, { useState, useEffect } from "react";
import prepareData, { ShoppingListPDFDataProps } from "@/pdf/ShoppingList/dataPreparation";
import PdfButton from "@/components/PdfButton/PdfButton";
import ShoppingListPDF from "@/pdf/ShoppingList/ShoppingListPDF";

interface Props {
    text: string;
    parcelId: string;
}

const ShoppingList = ({ text, parcelId }: Props): React.ReactElement => {
    const [data, setData] = useState<null | ShoppingListPDFDataProps>(null);

    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            const preparedData = await prepareData(parcelId);
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
            pdfComponent={ShoppingListPDF}
        />
    );
};

export default ShoppingList;
