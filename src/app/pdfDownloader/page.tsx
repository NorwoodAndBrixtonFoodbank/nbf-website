import { Metadata } from "next";
import React, { ReactElement } from "react";
import Title from "@/components/Title/Title";
import DayOverview from "@/components/DayOverview/DayOverview";

// Temporary page for now
const PdfDownloader = async (): Promise<ReactElement> => {
    const date = new Date("2023-07-17");
    const collectionCentreKey = "7c891da8-a4c1-4fb6-b1cd-c90ef5fbbca9";

    return (
        <main>
            <Title>PDF Downloader</Title>
            <DayOverview
                text="Download Day Overview"
                date={date}
                collectionCentreKey={collectionCentreKey}
            />
        </main>
    );
};

export const metadata: Metadata = {
    title: "PdfDownloader",
};

export default PdfDownloader;
