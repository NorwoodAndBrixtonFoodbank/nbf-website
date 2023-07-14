import SampleDataViewerWithButton from "@/components/DataViewer/SampleDataViewerWithButton";
import supabase, { Schema } from "@/supabase";
import { Metadata } from "next";

import React from "react";

const dataFetch: () => Promise<Schema["clients"][] | null> = async () => {
    const response = await supabase.from("clients").select();
    return response.data;
};

const Clients: () => Promise<React.ReactElement> = async () => {
    const data = await dataFetch();

    return (
        <main>
            <h1> Clients Page </h1>

            {/* This should be a separate component which is passed data via props */}
            <pre>{JSON.stringify(data, null, 4)}</pre>
            <SampleDataViewerWithButton data={data![0]}/>
        </main>
    );
};

export const metadata: Metadata = {
    title: "Clients",
};

export default Clients;
