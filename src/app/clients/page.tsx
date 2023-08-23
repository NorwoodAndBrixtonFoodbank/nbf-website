import { Metadata } from "next";
import React from "react";
import Title from "@/components/Title/Title";

// disables caching
export const revalidate = 0;

const Clients: () => Promise<React.ReactElement> = async () => {
    return (
        <main>
            <Title>Clients Page</Title>
        </main>
    );
};

export const metadata: Metadata = {
    title: "Clients",
};

export default Clients;
