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

const fetchComment = async (): Promise<any> => {
    const data = await supabase.from("website_data").select().eq("name", "lists_text");
    if (data.data) {
        return data.data![0].value;
    }
    return "";
};

const Lists = async (): Promise<ReactElement> => {
    const data = await fetchData();
    const comment = await fetchComment();

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
