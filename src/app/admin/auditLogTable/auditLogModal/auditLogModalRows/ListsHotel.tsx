"use client";

import React from "react";
import supabase from "@/supabaseClient";
import { logErrorReturnLogId } from "@/logger/logger";
import AuditLogModalRow, { TextValueContainer } from "../AuditLogModalRow";
import { AuditLogModalRowResponse } from "../types";

interface ListsHotelIngredientNameDetails {
    ingredientName: string;
}

type ListsHotelIngredientErrorType = "failedListsHotelFetch";
interface ListsHotelIngredientError {
    type: ListsHotelIngredientErrorType;
    logId: string;
}

const fetchListHotelIngredientName = async (
    eventId: string
): Promise<
    AuditLogModalRowResponse<ListsHotelIngredientNameDetails, ListsHotelIngredientError>
> => {
    const { data: data, error } = await supabase
        .from("lists_hotel")
        .select("item_name")
        .eq("primary_key", eventId)
        .limit(1)
        .single();

    if (error) {
        const logId = await logErrorReturnLogId("Error with fetch: lists hotel", {
            error: error,
        });
        return {
            data: null,
            error: { type: "failedListsHotelFetch", logId: logId },
        };
    }

    return { data: { ingredientName: data.item_name }, error: null };
};

const getErrorMessage = (error: ListsHotelIngredientError): string => {
    let errorMessage: string = "";
    switch (error.type) {
        case "failedListsHotelFetch":
            errorMessage = "Failed to fetch ingredient name.";
            break;
    }
    return `${errorMessage} Log ID: ${error.logId}`;
};

const ListsHotelIngredientName: React.FC<ListsHotelIngredientNameDetails> = ({
    ingredientName,
}) => <TextValueContainer>{ingredientName}</TextValueContainer>;

const ListsHotelAuditLogModalRow: React.FC<{ listsHotelId: string }> = ({ listsHotelId }) => (
    <AuditLogModalRow<ListsHotelIngredientNameDetails, ListsHotelIngredientError>
        foreignKey={listsHotelId}
        fetchResponse={fetchListHotelIngredientName}
        getErrorMessage={getErrorMessage}
        RowComponentWhenSuccessful={ListsHotelIngredientName}
        header="Lists Hotel Ingredient"
    />
);

export default ListsHotelAuditLogModalRow;
