import { Metadata } from "next";
import { Datum } from "@/components/Tables/Table";
import React from "react";
import { getClientsTableData, getProcessingData } from "@/app/clients/getClientsTableData";
import ClientsPage from "@/app/clients/ClientsPage";

const Clients: () => Promise<React.ReactElement> = async () => {
    const debugProcessingData: any = await getProcessingData(); // TODO REMOVE
    const data: Datum[] = await getClientsTableData();

    return (
        <main>
            <h1 tabIndex={0}> Clients Page </h1>

            <ClientsPage clientsTableData={data} />
            <pre>{JSON.stringify(debugProcessingData, null, 4)}</pre>
        </main>
    );
};

export const metadata: Metadata = {
    title: "Clients",
};

export default Clients;
