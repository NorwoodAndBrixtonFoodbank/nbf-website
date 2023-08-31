import { Schema } from "@/databaseUtils";
import { Metadata } from "next";
import React from "react";
import ListsDataView from "@/app/lists/ListDataview";
import Title from "@/components/Title/Title";
import supabase from "@/supabaseServer";
import { DatabaseError } from "@/app/errorClasses";

// disables caching
export const revalidate = 0;

interface Props {
    data: Schema["lists"][];
    comment: string;
}

const fetchList = async (): Promise<Schema["lists"][]> => {
    const { data, error } = await supabase.from("lists").select();
    if (error) {
        throw new DatabaseError("fetch", "lists data");
    }
    return data;
};

const fetchComment = async (): Promise<string> => {
    const { data, error } = await supabase.from("website_data").select().eq("name", "lists_text");
    if (error) {
        throw new DatabaseError("fetch", "lists comment");
    }
    return data[0].value ?? "";
};

const fetchData = async (): Promise<Props> => {
    const [data, comment] = await Promise.all([fetchList(), fetchComment()]);
    return { data, comment };
};

const Lists = async (): Promise<React.ReactElement> => {
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
