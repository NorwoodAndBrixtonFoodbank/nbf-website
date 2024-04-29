"use client";

import React from "react";
import supabase from "@/supabaseClient";
import { logErrorReturnLogId } from "@/logger/logger";
import { TextValueContainer } from "./AuditLogModal";
import { ForeignResponse } from "./types";
import GeneralForeignInfo from "./GeneralForeignInfo";

interface ListsIngredientName {
    ingredientName: string;
}

type ListsIngredientErrorType = "failedListsFetch";
interface ListsIngredientError {
    type: ListsIngredientErrorType;
    logId: string;
}

const fetchListIngredientName = async (
    eventId: string
): Promise<ForeignResponse<ListsIngredientName, ListsIngredientError>> => {
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

    return { data: {ingredientName: data.item_name}, error: null };
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

const ListsIngredientNameComponent: React.FC<ListsIngredientName> = ({ ingredientName }) => (
    <TextValueContainer>{ingredientName}</TextValueContainer>
);

const ListsIngredientName: React.FC<{ listsId: string }> = ({ listsId }) => (
    <GeneralForeignInfo<ListsIngredientName, ListsIngredientError>
        foreignKey={listsId}
        fetchResponse={fetchListIngredientName}
        getErrorMessage={getErrorMessage}
        SpecificInfoComponent={ListsIngredientNameComponent}
        header="Lists Ingredient"
    />
);

export default ListsIngredientName;