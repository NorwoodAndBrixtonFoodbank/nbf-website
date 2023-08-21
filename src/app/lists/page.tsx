import { Metadata } from "next";
import React, { ReactElement } from "react";
import ListsDataView, { ListRow } from "@/app/lists/ListDataview";
import Title from "@/components/Title/Title";
import { fetchLists, fetchComment } from "@/pdf/ShoppingList/databaseFetch";

// disables caching
export const revalidate = 0;

interface Props {
    data: ListRow[];
    comment: string;
}

const fetchData = async (): Promise<Props> => {
    const values = await Promise.all([fetchLists(), fetchComment()]);
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
