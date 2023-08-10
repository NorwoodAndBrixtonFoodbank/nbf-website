// TODO VFB-12 delete this page
// This is a sample page that will be removed once the PDF function is implemented in VFB-12-PDF

import { Metadata } from "next";
import React from "react";
import ShoppingList from "@/components/ShoppingList/ShoppingList";
import prepareData from "@/components/ShoppingList/dataPreparation";

const Shopping: () => Promise<React.ReactElement> = async () => {
    const TEST_PARCEL_ID = "cc6ea0e2-a284-410b-956b-99a55b853005";

    const data = await prepareData(TEST_PARCEL_ID);
    return (
        <main>
            <ShoppingList {...data} />
        </main>
    );
};

export const metadata: Metadata = {
    title: "Shopping",
};

export default Shopping;
