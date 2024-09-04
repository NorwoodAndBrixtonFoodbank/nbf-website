import { Metadata } from "next";
import React from "react";
import Title from "../../components/Title/Title";
import BatchParcelDataGrid from "@/app/batch-create/BatchParcelDataGrid";

const Batch: () => Promise<React.ReactElement> = async () => {
    return (
        <main>
            <Title>Batch client and parcel creation</Title>
            <BatchParcelDataGrid />
        </main>
    );
};

export const metadata: Metadata = {
    title: "Batch Creation",
};

export default Batch;
