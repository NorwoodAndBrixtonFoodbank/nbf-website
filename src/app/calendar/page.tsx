import supabase, { Schema } from "@/supabase";
import { Metadata } from "next";
import React from "react";

interface parcelRow {
    collection_centre: string | null;
    collection_datetime: Date | null;
    family_id: string;
    packing_datetime: Date | null;
    primary_key: string;
}

const dataFetch: () => Promise<Schema["parcels"][]> = async () => {
    const response = await supabase.from("parcels").select();
    return response.data ?? [];
};

const CalendarPage: () => Promise<React.ReactElement> = async () => {
    const data: Schema["parcels"][] = await dataFetch();

    return (
        <main>
            <h1> Clients Page </h1>

            <p> Testing Supabase fetching </p>

            {/* This should be a separate component which is passed data via props */}
            <pre>{JSON.stringify(data, null, 4)}</pre>
        </main>
    );
};

export const metadata: Metadata = {
    title: "Calendar",
};

export default CalendarPage;
