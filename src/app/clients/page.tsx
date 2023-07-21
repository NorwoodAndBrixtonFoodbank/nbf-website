import supabase, { Schema } from "@/supabase";
import { Metadata } from "next";
import { Datum } from "@/components/Tables/Table";
import React from "react";
import SampleDataViewerWithButton from "@/components/DataViewer/SampleDataViewerWithButton";

const dataFetch: () => Promise<Schema["clients"][]> = async () => {
    const response = await supabase.from("clients").select();
    return response.data ?? [];
};

const Clients: () => Promise<React.ReactElement> = async () => {
    const data: Datum[] = await dataFetch();

    return (
        <main>
            <SampleDataViewerWithButton data={data[0]} />

            {/* This should be a separate component which is passed data via props */}
            {/*<pre>{JSON.stringify(data, null, 4)}</pre>*/}
        </main>
    );
};

export const metadata: Metadata = {
    title: "Clients",
};

export default Clients;
