"use client";

import React from "react";
import supabase from "@/supabaseClient";
import { logErrorReturnLogId } from "@/logger/logger";
import { TextValueContainer } from "../AuditLogModal";
import { ForeignResponse } from "../types";
import GeneralForeignInfo from "../GeneralForeignInfo";

interface EventName {
    eventName: string;
}

type EventNameErrorType = "failedEventFetch";
interface EventNameError {
    type: EventNameErrorType;
    logId: string;
}

const fetchEventName = async (
    eventId: string
): Promise<ForeignResponse<EventName, EventNameError>> => {
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

    return { data: {eventName: data.new_parcel_status}, error: null };
};

const getErrorMessage = (error: EventNameError): string => {
    let errorMessage: string = "";
    switch (error.type) {
        case "failedEventFetch":
            errorMessage = "Failed to fetch collection centre name.";
            break;
    }
    return `${errorMessage} Log ID: ${error.logId}`;
};

const EventNameComponent: React.FC<EventName> = ({ eventName }) => (
    <TextValueContainer>{eventName}</TextValueContainer>
);

const EventName: React.FC<{ eventId: string }> = ({ eventId }) => (
    <GeneralForeignInfo<EventName, EventNameError>
        foreignKey={eventId}
        fetchResponse={fetchEventName}
        getErrorMessage={getErrorMessage}
        SpecificInfoComponent={EventNameComponent}
        header="event"
    />
);

export default EventName;