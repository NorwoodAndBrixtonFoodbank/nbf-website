import { Metadata } from "next";
import React from "react";
import { processingDataToClientsTableData } from "@/app/clients/getClientsTableData";
import { getCongestionChargeDetails, getProcessingData } from "@/app/clients/fetchDataFromServer";
import ClientsPage from "@/app/clients/ClientsPage";
import Title from "@/components/Title/Title";
import Error from "../error";

// disables caching
export const revalidate = 0;

const Clients: () => Promise<React.ReactElement> = async () => {
    const processingData = await getProcessingData();
    const congestionCharge = await getCongestionChargeDetails(processingData);
    const formattedData = processingDataToClientsTableData(processingData, congestionCharge);

    return (
        <main>
            <Title>Clients Page</Title>
            <ErrorBoundary fallback={<Error />}>
                <ClientsPage clientsTableData={data} />
            </ErrorBoundary>
        </main>
    );
};

export const metadata: Metadata = {
    title: "Clients",
};

export default Clients;
