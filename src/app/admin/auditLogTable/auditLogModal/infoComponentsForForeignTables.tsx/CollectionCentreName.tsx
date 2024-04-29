"use client";

import React from "react";
import supabase from "@/supabaseClient";
import { logErrorReturnLogId } from "@/logger/logger";
import { TextValueContainer } from "../AuditLogModal";
import { ForeignResponse } from "../types";
import GeneralForeignInfo from "../GeneralForeignInfo";

interface CollectionCentreName {
    collectionCentreName: string;
}

type CollectionCentreNameErrorType = "failedCollectionCentreNameFetch";
interface CollectionCentreNameError {
    type: CollectionCentreNameErrorType;
    logId: string;
}

const fetchCollectionCentreName = async (
    collectionCentreId: string
): Promise<ForeignResponse<CollectionCentreName, CollectionCentreNameError>> => {
    const { data: data, error } = await supabase
        .from("collection_centres")
        .select("primary_key, name")
        .eq("primary_key", collectionCentreId)
        .limit(1)
        .single();

    if (error) {
        const logId = await logErrorReturnLogId("Error with fetch: collection centres", {
            error: error,
        });
        return {
            data: null,
            error: { type: "failedCollectionCentreNameFetch", logId: logId },
        };
    }

    return { data: {collectionCentreName: data.name}, error: null };
};

const getErrorMessage = (error: CollectionCentreNameError): string => {
    let errorMessage: string = "";
    switch (error.type) {
        case "failedCollectionCentreNameFetch":
            errorMessage = "Failed to fetch collection centre name.";
            break;
    }
    return `${errorMessage} Log ID: ${error.logId}`;
};

const CollectionCentreNameComponent: React.FC<CollectionCentreName> = ({ collectionCentreName }) => (
    <TextValueContainer>{collectionCentreName}</TextValueContainer>
);

const CollectionCentreName: React.FC<{ collectionCentreId: string }> = ({ collectionCentreId }) => (
    <GeneralForeignInfo<CollectionCentreName, CollectionCentreNameError>
        foreignKey={collectionCentreId}
        fetchResponse={fetchCollectionCentreName}
        getErrorMessage={getErrorMessage}
        SpecificInfoComponent={CollectionCentreNameComponent}
        header="collection centre"
    />
);

export default CollectionCentreName;