import { Metadata } from "next";
import React from "react";
import { ClientsTableRow, getClientsTableData } from "@/app/clients/getClientsTableData";
import ClientsPage from "@/app/clients/ClientsPage";

const Clients: () => Promise<React.ReactElement> = async () => {
    const data: ClientsTableRow[] = await getClientsTableData();

    return (
        <main>
            <h1> Clients Page </h1>
            <ClientsPage clientsTableData={data} />
        </main>
    );
};

export const metadata: Metadata = {
    title: "Clients",
};

export default Clients;
