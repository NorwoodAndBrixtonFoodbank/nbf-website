import { Metadata } from "next";
import React, { ReactElement } from "react";
import Title from "@/components/Title/Title";
import Centerer from "@/app/pdfDownloader/pageUtils";
import ShippingsLabel from "@/components/ShippingLabels/ShippingLabel";
import DayOverview from "@/components/DayOverview/DayOverview";

const PdfDownloader = async (): Promise<ReactElement> => {
    const date = new Date("2023-07-17");
    const location = "Delivery";

    return (
        <main>
            <Title>PDF Downloader</Title>
            <Centerer>
                <ShippingsLabel text="Download Shipping Labels" />
            </Centerer>
            <Centerer>
                <DayOverview text="Download Day Overview" date={date} location={location} />
            </Centerer>
        </main>
    );
};

export const metadata: Metadata = {
    title: "PdfDownloader",
};

export default PdfDownloader;
