"use client";

import React, { useEffect, useState } from "react";
import { Schema } from "@/databaseUtils";
import supabase from "@/supabaseClient";
import { fetchComment, fetchLists } from "@/common/fetch";
import ListsDataView from "@/app/lists/ListDataview";

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
    const [listsData, setListsData] = useState<Schema["lists"][]>([]);
    const [comment, setComment] = useState("");

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            const fetchedData = await fetchData();
            setListsData(fetchedData.data);
            setComment(fetchedData.comment);
            setIsLoading(false);
        })();
    }, []);

    return isLoading ? (
        <></>
    ) : (
        <ListsDataView
            listOfIngridients={listsData}
            setListOfIngridients={setListsData}
            comment={comment}
        />
    );
};

export default ListsPage;
