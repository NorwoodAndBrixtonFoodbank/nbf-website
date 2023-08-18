import { Metadata } from "next";
import React, { ReactElement } from "react";
import Title from "@/components/Title/Title";
import Centerer from "@/app/pdfDownloader/pageUtils";
import ShippingsLabel from "@/components/ShippingLabels/ShippingLabel";

const PdfDownloader = async (): Promise<ReactElement> => {
    return (
        <main>
            <Title>PDF Downloader</Title>
            <Centerer>
                {/* @ts-ignore */}
                <ShippingsLabel text="Download Shipping Labels" />
            </Centerer>
        </main>
    );
};

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "PdfDownloader",
};

export default PdfDownloader;
