"use client";

import React from "react";
import supabase from "@/supabaseClient";
import { logErrorReturnLogId } from "@/logger/logger";
import AuditLogModalRow, { TextValueContainer } from "../AuditLogModalRow";
import { AuditLogModalRowResponse } from "../types";

interface CollectionCentreNameDetails {
    collectionCentreName: string;
}

type CollectionCentreNameErrorType = "failedCollectionCentreNameFetch";
interface CollectionCentreNameError {
    type: CollectionCentreNameErrorType;
    logId: string;
}

const fetchCollectionCentreName = async (
    collectionCentreId: string
): Promise<AuditLogModalRowResponse<CollectionCentreNameDetails, CollectionCentreNameError>> => {
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

    return { data: { collectionCentreName: data.name }, error: null };
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

const CollectionCentreName: React.FC<CollectionCentreNameDetails> = ({ collectionCentreName }) => (
    <TextValueContainer>{collectionCentreName}</TextValueContainer>
);

const CollectionCentreAuditLogModalRow: React.FC<{ collectionCentreId: string }> = ({
    collectionCentreId,
}) => (
    <AuditLogModalRow<CollectionCentreNameDetails, CollectionCentreNameError>
        foreignKey={collectionCentreId}
        fetchResponse={fetchCollectionCentreName}
        getErrorMessage={getErrorMessage}
        RowComponentWhenSuccessful={CollectionCentreName}
        header="collection centre"
    />
);

export default CollectionCentreAuditLogModalRow;
