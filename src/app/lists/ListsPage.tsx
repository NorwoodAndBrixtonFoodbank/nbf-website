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
import { subscriptionStatusRequiresErrorMessage } from "@/common/subscriptionStatusRequiresErrorMessage";
import { ListName } from "@/app/lists/ListStates";

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

const fetchListsData = async (): Promise<FetchListsDataResponse> => {
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

const formatListData = (listsData: Schema["lists"][]): ListRow[] => {
    return listsData.map(
        (row) =>
            ({
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
            }) as ListRow // this cast is needed here as the type system can't infer what Object.fromEntries will return
    );
};

const ListsPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [listData, setListData] = useState<ListRow[]>([]);
    const [comment, setComment] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [currentList, setCurrentList] = useState<ListName>("regular");    
    
    function handleSetError(error: string | null): void {
        setErrorMessage(error);
    }

    const filterData = (dataToFilter : FetchedListsData["listsData"]) : FetchedListsData["listsData"] => {
        return dataToFilter.filter(i => i.list_type.toString() == currentList);
    }

    const fetchAndSetData = async (): Promise<void> => {
        setIsLoading(true);
        setErrorMessage(null);
        const { data, error } = await fetchListsData();
        if (error) {
            setIsLoading(false);
            setErrorMessage(getErrorMessage(error));
            return;
        }
        const result = filterData(data.listsData)
        setListData(formatListData(result));
        setComment(data.comment);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchAndSetData();
    }, [currentList]);

    useEffect(() => {
        const subscriptionChannel = supabase
            .channel("lists-table-changes")
            .on("postgres_changes", { event: "*", schema: "public", table: "lists" }, async () => {
                await fetchAndSetData();
            })
            .subscribe((status, err) => {
                if (subscriptionStatusRequiresErrorMessage(status, err, "lists")) {
                    setErrorMessage("Failed to fetch lists data, please reload");
                } else {
                    setErrorMessage(null);
                }
            });
        return () => {
            void supabase.removeChannel(subscriptionChannel);
        };
    }, []);

    return isLoading ? (
        <></>
    ) : errorMessage ? (
        <ErrorSecondaryText>{errorMessage}</ErrorSecondaryText>
    ) : (
        <ListsDataView
            listOfIngredients={listData}
            setListOfIngredients={setListData}
            comment={comment}
            errorMessage={errorMessage}
            setErrorMessage={handleSetError}
            currentList={currentList}
            setCurrentList={setCurrentList}
        />
    );
};

export default ListsPage;
