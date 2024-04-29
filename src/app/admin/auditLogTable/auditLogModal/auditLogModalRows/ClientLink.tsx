"use client";

import React from "react";
import supabase from "@/supabaseClient";
import { logErrorReturnLogId } from "@/logger/logger";
import LinkButton from "@/components/Buttons/LinkButton";
import { AuditLogModalRowResponse } from "../types";
import AuditLogModalRow from "../AuditLogModalRow";

interface ClientLinkDetails {
    clientId: string;
    clientName: string;
}

type ClientLinkDetailsErrorType = "failedClientFetch";
interface ClientLinkDetailsError {
    type: ClientLinkDetailsErrorType;
    logId: string;
}

const fetchClientLinkDetails = async (
    clientId: string
): Promise<AuditLogModalRowResponse<ClientLinkDetails, ClientLinkDetailsError>> => {
    const { data: data, error } = await supabase
        .from("clients")
        .select("primary_key, full_name")
        .eq("primary_key", clientId)
        .limit(1)
        .single();

    if (error) {
        const logId = await logErrorReturnLogId("Error with fetch: clients", { error: error });
        return {
            data: null,
            error: { type: "failedClientFetch", logId: logId },
        };
    }

    return { data: { clientId: data.primary_key, clientName: data.full_name }, error: null };
};

const getErrorMessage = (error: ClientLinkDetailsError): string => {
    let errorMessage: string = "";
    switch (error.type) {
        case "failedClientFetch":
            errorMessage = "Failed to fetch client's details.";
            break;
    }
    return `${errorMessage} Log ID: ${error.logId}`;
};

const ClientLinkComponent: React.FC<ClientLinkDetails> = ({ clientId, clientName }) => (
    <LinkButton link={`/clients?clientId=${clientId}`}>{clientName}</LinkButton>
);

const ClientLink: React.FC<{ clientId: string }> = ({ clientId }) => (
    <AuditLogModalRow<ClientLinkDetails, ClientLinkDetailsError>
        foreignKey={clientId}
        fetchResponse={fetchClientLinkDetails}
        getErrorMessage={getErrorMessage}
        RowComponentWhenSuccessful={ClientLinkComponent}
        header="client"
    />
);

export default ClientLink;
