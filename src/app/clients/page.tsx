import { Metadata } from "next";
import { Datum } from "@/components/Tables/Table";
import React from "react";
import ClientsTable from "@/app/clients/ClientsTable";
import { getClientsTableData, getProcessingData } from "@/app/clients/getClientsTableData";

const Clients: () => Promise<React.ReactElement> = async () => {
    const debugProcessingData: any = await getProcessingData(); // TODO REMOVE
    const data: Datum[] = await getClientsTableData();

    return (
        <main>
            <h1 tabIndex={0}> Clients Page </h1>

            <ClientsTable clientsTableData={data} />
            <pre>{JSON.stringify(debugProcessingData, null, 4)}</pre>
        </main>
    );
};

export const metadata: Metadata = {
    title: "Clients",
};

export default Clients;
