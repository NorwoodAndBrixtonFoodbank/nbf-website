import { Metadata } from "next";
import React from "react";
import { getClientsTableData } from "@/app/clients/getClientsTableData";
import ClientsPage from "@/app/clients/ClientsPage";
import Title from "@/components/Title/Title";

// disables caching
export const revalidate = 0;

const Clients: () => Promise<React.ReactElement> = async () => {
    const data = await getClientsTableData();

    return (
        <main>
            <Title>Clients Page</Title>
            <ClientsPage clientsTableData={data} />
        </main>
    );
};

export const metadata: Metadata = {
    title: "Clients",
};

export default Clients;
