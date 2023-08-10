import { Metadata } from "next";
import React from "react";
import Title from "@/components/Title/Title";
import ShoppingListPage from "@/app/shopping-list/pdfPage";
import prepareData from "@/components/ShoppingList/dataPreparation";

const Shopping = async (): Promise<React.ReactElement> => {
    const TEST_PARCEL_ID = "f974254a-71f5-4ce0-83d1-359e3b5c5bf1";
    const data = await prepareData(TEST_PARCEL_ID);
    console.log(data);
    return (
        <main>
            <Title>Shopping List</Title>
            <ShoppingListPage data={data} />
        </main>
    );
};

export const metadata: Metadata = {
    title: "shopping-list",
};

export default Shopping;
