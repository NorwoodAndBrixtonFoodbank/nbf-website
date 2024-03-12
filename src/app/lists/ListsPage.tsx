"use client";

import React, { useEffect, useState } from "react";
import { Schema } from "@/databaseUtils";
import supabase from "@/supabaseClient";
import { fetchComment, fetchLists } from "@/common/fetch";
import ListsDataView, { ListRow, listsHeaderKeysAndLabels } from "@/app/lists/ListDataview";

interface FetchedListsData {
    data: Schema["lists"][];
    comment: string;
}

const fetchData = async (): Promise<FetchedListsData> => {
    const [data, comment] = await Promise.all([fetchLists(supabase), fetchComment(supabase)]);
    return { data, comment };
};

const ListsPage: React.FC<{}> = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [listsData, setListsData] = useState<ListRow[]>([]);
    const [comment, setComment] = useState("");

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            const fetchedData = await fetchData();
            setListsData(fetchedData.data.map((row) => {
                const newRow = {
                    primaryKey: row.primary_key,
                    rowOrder: row.row_order,
                    itemName: row.item_name,
                    ...Object.fromEntries(
                        listsHeaderKeysAndLabels
                            .filter(([key]) => /^\d+$/.test(key))
                            .map(([key]) => [
                                key,
                                {
                                    quantity: row[`quantity_for_${key}` as keyof Schema["lists"]],
                                    notes: row[`notes_for_${key}` as keyof Schema["lists"]],
                                },
                            ])
                    ),
                } as ListRow; // this cast is needed here as the type system can't infer what Object.fromEntries will return
                return newRow;
            }))
            setComment(fetchedData.comment);
            setIsLoading(false);
        })();
    }, []);

    return isLoading ? <></> : <ListsDataView data={listsData} comment={comment} />;
};

export default ListsPage;
