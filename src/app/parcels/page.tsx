import { Metadata } from "next";
import React from "react";
import { processingDataToClientsTableData } from "@/app/parcels/getParcelsTableData";
import { getCongestionChargeDetails, getProcessingData } from "@/app/parcels/fetchDataFromServer";
import ParcelsPage from "@/app/parcels/ParcelsPage";
import Title from "@/components/Title/Title";

// disables caching
export const revalidate = 0;

const Parcels: () => Promise<React.ReactElement> = async () => {
    const processingData = await getProcessingData();
    const congestionCharge = await getCongestionChargeDetails(processingData);
    const formattedData = processingDataToClientsTableData(processingData, congestionCharge);

    return (
        <main>
            <Title>Parcels Page</Title>
            <ParcelsPage clientsTableData={formattedData} />
        </main>
    );
};

export const metadata: Metadata = {
    title: "Parcels",
};

export default Parcels;
