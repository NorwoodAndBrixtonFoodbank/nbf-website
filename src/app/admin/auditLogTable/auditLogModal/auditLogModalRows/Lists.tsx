"use client";

import React from "react";
import supabase from "@/supabaseClient";
import { logErrorReturnLogId } from "@/logger/logger";
import AuditLogModalRow, { TextValueContainer } from "../AuditLogModalRow";
import { AuditLogModalRowResponse } from "../types";

interface ListsIngredientNameDetails {
    ingredientName: string;
}

type ListsIngredientErrorType = "failedListsFetch";
interface ListsIngredientError {
    type: ListsIngredientErrorType;
    logId: string;
}

const fetchListIngredientName = async (
    eventId: string
): Promise<AuditLogModalRowResponse<ListsIngredientNameDetails, ListsIngredientError>> => {
    const { data: data, error } = await supabase
        .from("lists")
        .select("item_name")
        .eq("primary_key", eventId)
        .limit(1)
        .single();

    if (error) {
        const logId = await logErrorReturnLogId("Error with fetch: lists", {
            error: error,
        });
        return {
            data: null,
            error: { type: "failedListsFetch", logId: logId },
        };
    }

    return { data: { ingredientName: data.item_name }, error: null };
};

const getErrorMessage = (error: ListsIngredientError): string => {
    let errorMessage: string = "";
    switch (error.type) {
        case "failedListsFetch":
            errorMessage = "Failed to fetch ingredient name.";
            break;
    }
    return `${errorMessage} Log ID: ${error.logId}`;
};

const ListsIngredientName: React.FC<ListsIngredientNameDetails> = ({ ingredientName }) => (
    <TextValueContainer>{ingredientName}</TextValueContainer>
);

const ListsAuditLogModalRow: React.FC<{ listsId: string }> = ({ listsId }) => (
    <AuditLogModalRow<ListsIngredientNameDetails, ListsIngredientError>
        foreignKey={listsId}
        fetchResponse={fetchListIngredientName}
        getErrorMessage={getErrorMessage}
        RowComponentWhenSuccessful={ListsIngredientName}
        header="Lists Ingredient"
    />
);

export default ListsAuditLogModalRow;
