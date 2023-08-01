import { Metadata } from "next";
import React from "react";
import PdfFileModal from "@/app/samplePageForTomWillNotBeMergeOnMain/PdfFileModal";

const SamplePageForTomWillNotBeMergeOnMain: React.FC<{}> = () => {

    return (
        <main>
            <h1> Sample Page For PDF printing </h1>
            <p>This page is to keep Tom happy, its a sample, but we will not merge this to main</p>
            <PdfFileModal />
        </main>
    );
};

export const metadata: Metadata = {
    title: "SamplePageForTomWillNotBeMergeOnMain",
};

export default SamplePageForTomWillNotBeMergeOnMain;
