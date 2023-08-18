import { Metadata } from "next";
import React from "react";
import { getClientsTableData, getCountClientsTableData } from "@/app/clients/getClientsTableData";
import ClientsPage from "@/app/clients/ClientsPage";
import Title from "@/components/Title/Title";

const Clients: () => Promise<React.ReactElement> = async () => {
    const data = await getClientsTableData(0, 9);
    const count = await getCountClientsTableData();
    return (
        <main>
            <Title>Clients Page</Title>
            <ClientsPage count={count} initClientsTableData={data} />
        </main>
    );
};

export const metadata: Metadata = {
    title: "Clients",
};

export default Clients;
