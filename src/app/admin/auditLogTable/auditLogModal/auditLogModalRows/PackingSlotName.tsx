"use client";

import React from "react";
import supabase from "@/supabaseClient";
import { logErrorReturnLogId } from "@/logger/logger";
import AuditLogModalRow, { TextValueContainer } from "../AuditLogModalRow";
import { AuditLogModalRowResponse } from "../types";

interface PackingSlotNameDetails {
    packingSlotName: string;
}

type PackingSlotNameErrorType = "failedPackingSlotsFetch";
interface PackingSlotNameError {
    type: PackingSlotNameErrorType;
    logId: string;
}

const fetchPackingSlotName = async (
    packingSlotId: string
): Promise<AuditLogModalRowResponse<PackingSlotNameDetails, PackingSlotNameError>> => {
    const { data: data, error } = await supabase
        .from("packing_slots")
        .select("primary_key, name")
        .eq("primary_key", packingSlotId)
        .limit(1)
        .single();

    if (error) {
        const logId = await logErrorReturnLogId("Error with fetch: packing slots", {
            error: error,
        });
        return {
            data: null,
            error: { type: "failedPackingSlotsFetch", logId: logId },
        };
    }

    return { data: { packingSlotName: data.name }, error: null };
};

const getErrorMessage = (error: PackingSlotNameError): string => {
    let errorMessage: string = "";
    switch (error.type) {
        case "failedPackingSlotsFetch":
            errorMessage = "Failed to fetch packing slots name.";
            break;
    }
    return `${errorMessage} Log ID: ${error.logId}`;
};

const PackingSlotNameComponent: React.FC<PackingSlotNameDetails> = ({ packingSlotName }) => (
    <TextValueContainer>{packingSlotName}</TextValueContainer>
);

const PackingSlotName: React.FC<{ packingSlotId: string }> = ({ packingSlotId }) => (
    <AuditLogModalRow<PackingSlotNameDetails, PackingSlotNameError>
        foreignKey={packingSlotId}
        fetchResponse={fetchPackingSlotName}
        getErrorMessage={getErrorMessage}
        RowComponentWhenSuccessful={PackingSlotNameComponent}
        header="packing slot"
    />
);

export default PackingSlotName;
