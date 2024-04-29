"use client";

import React from "react";
import supabase from "@/supabaseClient";
import { logErrorReturnLogId } from "@/logger/logger";
import AuditLogModalRow, { TextValueContainer } from "../AuditLogModalRow";
import { AuditLogModalRowResponse } from "../types";

interface EventNameDetails {
    eventName: string;
}

type EventNameErrorType = "failedEventFetch";
interface EventNameError {
    type: EventNameErrorType;
    logId: string;
}

const fetchEventName = async (
    eventId: string
): Promise<AuditLogModalRowResponse<EventNameDetails, EventNameError>> => {
    const { data: data, error } = await supabase
        .from("events")
        .select("primary_key, new_parcel_status")
        .eq("primary_key", eventId)
        .limit(1)
        .single();

    if (error) {
        const logId = await logErrorReturnLogId("Error with fetch: events", {
            error: error,
        });
        return {
            data: null,
            error: { type: "failedEventFetch", logId: logId },
        };
    }

    return { data: { eventName: data.new_parcel_status }, error: null };
};

const getErrorMessage = (error: EventNameError): string => {
    let errorMessage: string = "";
    switch (error.type) {
        case "failedEventFetch":
            errorMessage = "Failed to fetch event data.";
            break;
    }
    return `${errorMessage} Log ID: ${error.logId}`;
};

const EventNameComponent: React.FC<EventNameDetails> = ({ eventName }) => (
    <TextValueContainer>{eventName}</TextValueContainer>
);

const EventName: React.FC<{ eventId: string }> = ({ eventId }) => (
    <AuditLogModalRow<EventNameDetails, EventNameError>
        foreignKey={eventId}
        fetchResponse={fetchEventName}
        getErrorMessage={getErrorMessage}
        RowComponentWhenSuccessful={EventNameComponent}
        header="event"
    />
);

export default EventName;
