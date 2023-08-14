import { Metadata } from "next";
import React from "react";
import Title from "@/components/Title/Title";
import ShoppingListPage from "@/app/shopping-list/ShoppingListPage";
import prepareData from "@/pdf/ShoppingList/dataPreparation";

const ShoppingList = async (): Promise<React.ReactElement> => {
    const TEST_PARCEL_ID = "85b7626f-a843-4d5e-9043-44a37a73c8aa";
    const data = await prepareData(TEST_PARCEL_ID);
    return (
        <main>
            <Title>Shopping List</Title>
            <p>For Parcel ID: {TEST_PARCEL_ID}</p>
            <br />
            <ShoppingListPage data={data} />
        </main>
    );
};

export const metadata: Metadata = {
    title: "shopping-list",
};

export default ShoppingList;
