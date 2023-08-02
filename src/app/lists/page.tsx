import { Metadata } from "next";
import React, { ReactElement } from "react";
import ListsDataView from "@/app/lists/Dataview";
import supabase, { Schema } from "@/supabase";

export const revalidate = 0;

const fetchData = async (): Promise<Schema["lists"][]> => {
    const response = await supabase.from("lists").select("*");
    return response.data ?? [];
};

const Lists = async (): Promise<ReactElement> => {
    const data: Schema["lists"][] = await fetchData();

    return (
        <main>
            <h1>Lists Page</h1>
            <ListsDataView data={data} />
        </main>
    );
};

export const metadata: Metadata = {
    title: "Lists",
};

export default Lists;
