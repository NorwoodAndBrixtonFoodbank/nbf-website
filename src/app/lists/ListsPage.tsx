"use client";

import React, { useEffect, useState } from "react";
import { Schema } from "@/databaseUtils";
import supabase from "@/supabaseClient";
import { fetchComment, fetchLists } from "@/common/fetch";
import ListsDataView, { ListRow, listsHeaderKeysAndLabels } from "@/app/lists/ListDataview";
import { logErrorReturnLogId } from "@/logger/logger";
import { subscriptionStatusRequiresErrorMessage } from "@/common/subscriptionStatusRequiresErrorMessage";

interface FetchedListsData {
    data: Schema["lists"][];
    comment: string;
}

const fetchListData = async (): Promise<FetchedListsData> => {
    const [data, comment] = await Promise.all([fetchLists(supabase), fetchComment(supabase)]);
    return { data, comment };
};

const formatListData = (listData: FetchedListsData): ListRow[] => {
    return listData.data.map((row) => {
        return {
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
    });
};

const ListsPage: React.FC<{}> = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [listData, setListData] = useState<ListRow[]>([]);
    const [comment, setComment] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            const listData = await fetchListData();
            setListData(formatListData(listData));
            setComment(listData.comment);
            setIsLoading(false);
        })();
    }, []);

    useEffect(() => {
        // This requires that the DB table has Realtime turned on
        const subscriptionChannel = supabase
            .channel("lists-table-changes")
            .on("postgres_changes", { event: "*", schema: "public", table: "lists" }, async () => {
                setErrorMessage(null);
                try {
                    const listData = await fetchListData();
                    setListData(formatListData(listData));
                } catch (error) {
                    const logId = logErrorReturnLogId("Error with fetch: list data subscription", {
                        error: error,
                    });
                    setListData([]);
                    setErrorMessage(`Error fetching data, please reload. Log ID: ${logId}`);
                }
            })
            .subscribe((status, err) => {
                if (subscriptionStatusRequiresErrorMessage(status, err, "website_data")) {
                    setErrorMessage("Failed to fetch lists data, please reload");
                }
            });
        return () => {
            void supabase.removeChannel(subscriptionChannel);
        };
    }, []);

    return isLoading ? (
        <></>
    ) : (
        <ListsDataView
            listOfIngredients={listData}
            setListOfIngredients={setListData}
            comment={comment}
            error={errorMessage}
        />
    );
};

export default ListsPage;
