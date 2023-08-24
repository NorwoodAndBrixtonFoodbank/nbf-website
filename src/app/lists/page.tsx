import { Metadata } from "next";
import React, { ReactElement } from "react";
import ListsDataView, { ListRow } from "@/app/lists/ListDataview";
import Title from "@/components/Title/Title";
import supabase from "@/supabaseServer";
import { FetchError } from "@/app/errorClasses";

// disables caching
export const revalidate = 0;

interface Props {
    data: ListRow[];
    comment: string;
}

const fetchList = async (): Promise<ListRow[]> => {
    const { data, error } = await supabase.from("lists").select();
    if (error) {
        throw new FetchError("the lists data");
    }
    return data;
};

const fetchComment = async (): Promise<string> => {
    const { data, error } = await supabase.from("website_data").select().eq("name", "lists_text");
    if (error) {
        throw new FetchError("the lists comment");
    }
    return data?.[0]?.value ?? "";
};

const fetchData = async (): Promise<Props> => {
    const values = await Promise.all([fetchList(), fetchComment()]);
    return { data: values[0], comment: values[1] };
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
