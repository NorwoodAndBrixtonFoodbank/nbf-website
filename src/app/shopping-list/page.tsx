// TODO: delete this page

import { Metadata } from "next";
import React from "react";
import ShoppingList from "@/components/ShoppingList/ShoppingList";
import prepareData from "@/components/ShoppingList/dataPreparation";

const Shopping: () => Promise<React.ReactElement> = async () => {
    const TEST_PARCEL_ID = "cc6ea0e2-a284-410b-956b-99a55b853005";

    const fullData = await prepareData(TEST_PARCEL_ID);
    return (
        <main>
            <ShoppingList {...fullData} />
        </main>
    );
};

export const metadata: Metadata = {
    title: "Shopping",
};

export default Shopping;
