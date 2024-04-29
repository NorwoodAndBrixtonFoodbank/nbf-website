"use client";

import React from "react";
import supabase from "@/supabaseClient";
import { logErrorReturnLogId } from "@/logger/logger";
import { TextValueContainer } from "./AuditLogModal";
import { ForeignResponse } from "./types";
import GeneralForeignInfo from "./GeneralForeignInfo";

interface ListsHotelIngredientName {
    ingredientName: string;
}

type ListsHotelIngredientErrorType = "failedListsHotelFetch";
interface ListsHotelIngredientError {
    type: ListsHotelIngredientErrorType;
    logId: string;
}

const fetchListIngredientName = async (
    eventId: string
): Promise<ForeignResponse<ListsHotelIngredientName, ListsHotelIngredientError>> => {
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

    return { data: {ingredientName: data.item_name}, error: null };
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

const ListsHotelIngredientNameComponent: React.FC<ListsHotelIngredientName> = ({ ingredientName }) => (
    <TextValueContainer>{ingredientName}</TextValueContainer>
);

const ListsHotelIngredientName: React.FC<{ listsHotelId: string }> = ({ listsHotelId }) => (
    <GeneralForeignInfo<ListsHotelIngredientName, ListsHotelIngredientError>
        foreignKey={listsHotelId}
        fetchResponse={fetchListIngredientName}
        getErrorMessage={getErrorMessage}
        SpecificInfoComponent={ListsHotelIngredientNameComponent}
        header="Lists Hotel Ingredient"
    />
);

export default ListsHotelIngredientName;