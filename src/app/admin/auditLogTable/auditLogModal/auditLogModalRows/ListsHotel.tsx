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

const getListsHotelIngredientNameOrErrorMessage = async (
    eventId: string
): Promise<AuditLogModalRowResponse<ListsHotelIngredientNameDetails>> => {
    const { data: data, error } = await supabase
        .from("lists_hotel")
        .select("item_name")
        .eq("primary_key", eventId)
        .single();

    if (error) {
        const logId = await logErrorReturnLogId("Error with fetch: lists hotel", {
            error: error,
        });
        return {
            data: null,
            errorMessage: getErrorMessage({ type: "failedListsHotelFetch", logId: logId }),
        };
    }

    return { data: { ingredientName: data.item_name }, errorMessage: null };
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
    <AuditLogModalRow<ListsHotelIngredientNameDetails>
        getDataOrErrorMessage={() => getListsHotelIngredientNameOrErrorMessage(listsHotelId)}
        RowComponentWhenSuccessful={ListsHotelIngredientName}
        header="Lists Hotel Ingredient"
    />
);

export default ListsHotelAuditLogModalRow;
