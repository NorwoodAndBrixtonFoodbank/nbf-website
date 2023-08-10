import { Metadata } from "next";
import React, { ReactElement } from "react";
import ListsDataView, { ListRow } from "@/app/lists/ListDataview";
import supabase from "@/supabase";
import Title from "@/components/Title/Title";

// disables caching
export const revalidate = 0;

const fetchData = async (): Promise<ListRow[]> => {
    const { data } = await supabase.from("lists").select();
    return data ?? [];
};

const Lists = async (): Promise<ReactElement> => {
    const data = await fetchData();

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
