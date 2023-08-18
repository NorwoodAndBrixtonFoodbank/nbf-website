import { Metadata } from "next";
import React, { ReactElement } from "react";
import Title from "@/components/Title/Title";
import Centerer from "@/app/pdf-downloader/pageUtils";
import ShippingsLabel from "@/pdf/ShippingLabels/ShippingLabel";
import ShoppingList from "@/pdf/ShoppingList/ShoppingList";

// disables caching
export const revalidate = 0;

const PdfDownloader = async (): Promise<ReactElement> => {
    const TEST_PARCEL_ID = "85b7626f-a843-4d5e-9043-44a37a73c8aa";
    return (
        <main>
            <Title>PDF Downloader</Title>
            <Centerer>
                <ShippingsLabel text="Download Shipping Labels" />
            </Centerer>
            <Centerer>
                <ShoppingList text="Download Shopping Lists" parcelID={TEST_PARCEL_ID} />
            </Centerer>
        </main>
    );
};

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "PDF Downloader",
};

export default PdfDownloader;
