"use client";

import React, { useCallback, useEffect, useState, useRef } from "react";
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

const filterDataByListType = (
    dataToFilter: FetchedListsData["listsData"],
    currentList: ListName
): FetchedListsData["listsData"] => {
    const toReturn = dataToFilter.filter((item) => item.list_type.toString() == currentList.toLowerCase());
    return toReturn;
};

let currentListValue : ListName;

const ListsPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [listData, setListData] = useState<ListRow[]>([]);
    const [comment, setComment] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [currentList, setCurrentList] = useState<ListName>("Regular");
    const listsTableFetchAbortController = useRef<AbortController | null>(null);

    currentListValue = currentList;

    function handleSetError(error: string | null): void {
        setErrorMessage(error);
    }

    const fetchAndSetData = useCallback(async (currentListValue : ListName): Promise<void> => {
        setIsLoading(true);
        if (listsTableFetchAbortController.current) {
            listsTableFetchAbortController.current.abort("stale request");
        }
        listsTableFetchAbortController.current = new AbortController();
        if (listsTableFetchAbortController.current) {
            setErrorMessage(null);
            const { data, error } = await fetchListsData();
            if (error) {
                setIsLoading(false);
                setErrorMessage(getErrorMessage(error));
                return;
            }       
            const result = filterDataByListType(data.listsData, currentListValue);
            setListData(formatListData(result));
            setComment(data.comment);
            listsTableFetchAbortController.current = null;
            setIsLoading(false);
        }
    }, [setIsLoading, setErrorMessage, setListData, setComment]);


    // const cachedFetchAndSetData = useCallback(() => {
    //     fetchAndSetData();
    // }, [setIsLoading, setErrorMessage, setErrorMessage, setListData, setComment, fetchAndSetData]);

    
    useEffect(() => {
        fetchAndSetData(currentListValue);
    }, [currentList]);

    useEffect(() => {
        const subscriptionChannel = supabase
            .channel("lists-table-changes")
            .on("postgres_changes", { event: "*", schema: "public", table: "lists" }, async () => {
                await fetchAndSetData(currentListValue);
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
