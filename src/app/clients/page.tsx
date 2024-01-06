import { Metadata } from "next";
import React from "react";
import Title from "@/components/Title/Title";
import ClientsPage from "@/app/clients/ClientsPage";

const Clients: () => Promise<React.ReactElement> = async () => {
    return (
        <main>
            <Title>Clients Page</Title>
            <ClientsPage />
        </main>
    );
};

export const metadata: Metadata = {
    title: "Clients",
};

export default Clients;
