import { Metadata } from "next";
import React, { ReactElement } from "react";
import ListsDataView, { ListRow } from "@/app/lists/ListDataview";
import supabase, { Schema } from "@/supabase";
import Title from "@/components/Title/Title";

// disables caching
export const revalidate = 0;

const fetchData = async (): Promise<Schema["lists"][]> => {
    const { data } = await supabase.from("lists").select();
    return data ?? [];
};

const Lists = async (): Promise<ReactElement> => {
    const data: ListRow[] = await fetchData();

    return (
        <main>
            <Title>Lists</Title>
            <ListsDataView data={data} />
        </main>
    );
};

export const metadata: Metadata = {
    title: "Lists",
};

export default Lists;
