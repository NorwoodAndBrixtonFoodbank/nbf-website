import { Metadata } from "next";
import React from "react";
import Title from "@/components/Title/Title";
import BatchParcelDataGrid, { defaultData } from "@/app/parcels/batch/BatchParcelDataGrid";

const Batch: () => Promise<React.ReactElement> = async () => {
    return (
        <main>
            <Title>Batch parcel creation - work in progress, do not use</Title>
            <BatchParcelDataGrid rows={defaultData} />
        </main>
    );
};

export const metadata: Metadata = {
    title: "Batch",
};

export default Batch;
