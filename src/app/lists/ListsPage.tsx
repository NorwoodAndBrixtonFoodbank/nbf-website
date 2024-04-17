"use client";

import React, { useEffect, useState } from "react";
import { Schema } from "@/databaseUtils";
import supabase from "@/supabaseClient";
import {
    FetchListsCommentError,
    FetchListsError,
    fetchListsComment,
    fetchLists,
} from "@/common/fetch";
import ListsDataView, { ListRow, listsHeaderKeysAndLabels } from "@/app/lists/ListDataview";
import { ErrorSecondaryText } from "../errorStylingandMessages";

interface FetchedListsData {
    listsData: Schema["lists"][];
    comment: string;
}

type FetchListsDataResponse =
    | {
          data: FetchedListsData;
          error: null;
      }
    | {
          data: null;
          error: FetchListsError | FetchListsCommentError;
      };

const fetchData = async (): Promise<FetchListsDataResponse> => {
    const { data: listsData, error: listsError } = await fetchLists(supabase);
    if (listsError) {
        return { data: null, error: listsError };
    }
    const { data: listsCommentData, error: listsCommentError } = await fetchListsComment(supabase);
    if (listsCommentError) {
        return { data: null, error: listsCommentError };
    }
    return { data: { listsData: listsData, comment: listsCommentData }, error: null };
};

const getErrorMessage = (error: FetchListsError | FetchListsCommentError): string => {
    let errorMessage: string;
    switch (error.type) {
        case "listsFetchFailed":
            errorMessage = "Failed to fetch lists data.";
            break;
        case "listsCommentFetchFailed":
            errorMessage = "Failed to fetch lists comment.";
            break;
    }
    return `${errorMessage} Log ID: ${error.logId}`;
};

const ListsPage: React.FC<{}> = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [listsData, setListsData] = useState<ListRow[]>([]);
    const [comment, setComment] = useState("");
    const [error, setError] = useState<FetchListsError | FetchListsCommentError | null>(null);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            setError(null);
            const { data, error } = await fetchData();
            if (error) {
                setIsLoading(false);
                setError(error);
                return;
            }
            setListsData(
                data.listsData.map((row) => {
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
                                        quantity:
                                            row[`quantity_for_${key}` as keyof Schema["lists"]],
                                        notes: row[`notes_for_${key}` as keyof Schema["lists"]],
                                    },
                                ])
                        ),
                    } as ListRow; // this cast is needed here as the type system can't infer what Object.fromEntries will return
                    return newRow;
                })
            );
            setComment(data.comment);
            setIsLoading(false);
        })();
    }, []);

    return isLoading ? (
        <></>
    ) : error ? (
        <ErrorSecondaryText>{getErrorMessage(error)}</ErrorSecondaryText>
    ) : (
        <ListsDataView
            listOfIngredients={listsData}
            setListOfIngredients={setListsData}
            comment={comment}
        />
    );
};

export default ListsPage;
