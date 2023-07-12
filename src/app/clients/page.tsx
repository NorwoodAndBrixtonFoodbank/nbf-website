import supabase, { Schema } from "@/supabase";
import { Metadata } from "next";
import Table from "@/components/Tables/Table";
import React from "react";

const dataFetch: () => Promise<Schema["clients"][] | null> = async () => {
    const response = await supabase.from("clients").select();
    return response.data;
};

const Clients: () => Promise<React.ReactElement> = async () => {
    const data = await dataFetch();

    if (data === null) {
        return (
            <main>
                <h1> Clients Page </h1>
                <p> Error: Data not found</p>
            </main>
        );
    }

    const headers: { [key: string]: string } = {
        full_name: "Name",
        phone_number: "Phone Number",
        address_1: "Address",
        address_2: "Address 2",
        address_3: "Address 3",
    };

    return (
        <main>
            <h1> Clients Page </h1>

            {/* This should be a separate component which is passed data via props */}
            <pre>{JSON.stringify(data, null, 4)}</pre>
        </main>
    );
};

export const metadata: Metadata = {
    title: "Clients",
};

export default Clients;
