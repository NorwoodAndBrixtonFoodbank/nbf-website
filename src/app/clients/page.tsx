import { Metadata } from "next";
import React from "react";
import Title from "@/components/Title/Title";
import ClientsPage from "@/app/clients/ClientsPage";
import getClientsData from "@/app/clients/getClientsData";

// disables caching
export const revalidate = 0;

const Clients: () => Promise<React.ReactElement> = async () => {
    const data = await getClientsData();

    return (
        <main>
            <Title>Clients Page</Title>
            <ClientsPage data={data} />
        </main>
    );
};

export const metadata: Metadata = {
    title: "Clients",
};

export default Clients;
