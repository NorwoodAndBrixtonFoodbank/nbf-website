import { fetchComment, fetchLists } from "@/common/fetch";
import { Schema } from "@/databaseUtils";
import { Metadata } from "next";
import React from "react";
import ListsDataView from "@/app/lists/ListDataview";
import Title from "@/components/Title/Title";
import supabase from "@/supabaseServer";

// disables caching
export const revalidate = 0;

interface Props {
    data: Schema["lists"][];
    comment: string;
}

const fetchData = async (): Promise<Props> => {
    const [data, comment] = await Promise.all([fetchLists(supabase), fetchComment(supabase)]);
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
