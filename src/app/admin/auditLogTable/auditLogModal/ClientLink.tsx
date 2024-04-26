"use client";

import React, { useEffect, useState } from "react";
import supabase from "@/supabaseClient";
import { logErrorReturnLogId } from "@/logger/logger";
import LinkButton from "@/components/Buttons/LinkButton";
import { AuditLogModalItem, ErrorContainer, Key, LinkContainer } from "./AuditLogModal";
import { ErrorSecondaryText } from "@/app/errorStylingandMessages";

interface ClientLinkProps {
    clientId: string;
}

type ClientNameResponse =
    | {
          clientName: string;
          error: null;
      }
    | {
          clientName: null;
          error: ClientNameError;
      };

type ClientNameErrorType = "failedClientNameFetch";
interface ClientNameError {
    type: ClientNameErrorType;
    logId: string;
}

const fetchClientName = async (clientId: string): Promise<ClientNameResponse> => {
    const { data: data, error } = await supabase
        .from("clients")
        .select("primary_key, full_name")
        .eq("primary_key", clientId)
        .limit(1)
        .single();

    if (error) {
        const logId = await logErrorReturnLogId("Error with fetch: clients", { error: error });
        return {
            clientName: null,
            error: { type: "failedClientNameFetch", logId: logId },
        };
    }

    return { clientName: data.full_name, error: null };
};

const getErrorMessage = (error: ClientNameError): string => {
    let errorMessage: string = "";
    switch (error.type) {
        case "failedClientNameFetch":
            errorMessage = "Failed to fetch client's name.";
            break;
    }
    return `${errorMessage} Log ID: ${error.logId}`;
};

const ClientLink: React.FC<ClientLinkProps> = ({ clientId }) => {
    const [clientName, setClientName] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            const { clientName, error } = await fetchClientName(clientId);
            if (error) {
                setErrorMessage(getErrorMessage(error));
                return;
            }
            setClientName(clientName);
        })();
    }, [clientId]);

    return (
        <AuditLogModalItem>
            <Key>CLIENT: </Key>
            {clientName && (
                <LinkContainer>
                    <LinkButton link={`/clients?clientId=${clientId}`}>{clientName}</LinkButton>
                </LinkContainer>
            )}
            {errorMessage && (
                <ErrorContainer>
                    <ErrorSecondaryText>{errorMessage}</ErrorSecondaryText>
                </ErrorContainer>
            )}
        </AuditLogModalItem>
    );
};

export default ClientLink;
