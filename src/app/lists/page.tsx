import { Metadata } from "next";
import React, { ReactElement } from "react";
import ListsDataView from "@/app/lists/ListDataview";
import supabase from "@/supabaseServer";
import Title from "@/components/Title/Title";
import { Schema } from "@/database_utils";

// disables caching
export const revalidate = 0;

interface Props {
    data: Schema["lists"][];
    comment: string;
}

const fetchData = async (): Promise<Props> => {
    const values = await Promise.all([
        supabase.from("lists").select(),
        supabase.from("website_data").select().eq("name", "lists_text"),
    ]);
    return { data: values[0].data ?? [], comment: values[1].data![0].value ?? "" };
};

const Lists = async (): Promise<ReactElement> => {
    const { data, comment } = await fetchData();
    return (
        <main>
            <Title>Lists</Title>
            <ListsDataView data={data} comment={comment} />
        </main>
    );
};

export const metadata: Metadata = {
    title: "Lists",
};

export default Lists;
