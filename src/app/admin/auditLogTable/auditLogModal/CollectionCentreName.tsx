"use client";

import React, { useEffect, useState } from "react";
import supabase from "@/supabaseClient";
import { logErrorReturnLogId } from "@/logger/logger";
import { AuditLogModalItem, TextValueContainer, Key } from "./AuditLogModal";
import { ErrorSecondaryText } from "@/app/errorStylingandMessages";

interface CollectionCentreNameProps {
    collectionCentreId: string;
}

type CollectionCentreNameResponse =
    | {
          collectionCentreName: string;
          error: null;
      }
    | {
          collectionCentreName: null;
          error: CollectionCentreNameError;
      };

type CollectionCentreNameErrorType = "failedCollectionCentreNameFetch";
interface CollectionCentreNameError {
    type: CollectionCentreNameErrorType;
    logId: string;
}

const fetchCollectionCentreName = async (
    collectionCentreId: string
): Promise<CollectionCentreNameResponse> => {
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
            collectionCentreName: null,
            error: { type: "failedCollectionCentreNameFetch", logId: logId },
        };
    }

    return { collectionCentreName: data.name, error: null };
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

const CollectionCentreName: React.FC<CollectionCentreNameProps> = ({ collectionCentreId }) => {
    const [collectionCentreName, setCollectionCentreName] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            const { collectionCentreName, error } =
                await fetchCollectionCentreName(collectionCentreId);
            if (error) {
                setErrorMessage(getErrorMessage(error));
                return;
            }
            setCollectionCentreName(collectionCentreName);
        })();
    }, [collectionCentreId]);

    return (
        <AuditLogModalItem>
            <Key>COLLECTION CENTRE: </Key>
            {collectionCentreName && (
                <TextValueContainer>{collectionCentreName}</TextValueContainer>
            )}
            {errorMessage && (
                <TextValueContainer>
                    <ErrorSecondaryText>{errorMessage}</ErrorSecondaryText>
                </TextValueContainer>
            )}
        </AuditLogModalItem>
    );
};

export default CollectionCentreName;
