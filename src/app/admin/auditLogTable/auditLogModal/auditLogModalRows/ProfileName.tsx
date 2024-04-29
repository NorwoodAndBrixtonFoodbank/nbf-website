"use client";

import React from "react";
import supabase from "@/supabaseClient";
import { logErrorReturnLogId } from "@/logger/logger";
import AuditLogModalRow, { TextValueContainer } from "../AuditLogModalRow";
import { AuditLogModalRowResponse } from "../types";
import { displayProfileName } from "../../format";

interface ProfileNameDetails {
    firstName: string;
    lastName: string;
    userId: string | null;
}

type ProfileNameErrorType = "failedProfileFetch";
interface ProfileNameError {
    type: ProfileNameErrorType;
    logId: string;
}

const fetchEventName = async (
    profileId: string
): Promise<AuditLogModalRowResponse<ProfileNameDetails, ProfileNameError>> => {
    const { data: data, error } = await supabase
        .from("profiles")
        .select("primary_key, first_name, last_name, user_id")
        .eq("primary_key", profileId)
        .limit(1)
        .single();

    if (error) {
        const logId = await logErrorReturnLogId("Error with fetch: profiles", {
            error: error,
        });
        return {
            data: null,
            error: { type: "failedProfileFetch", logId: logId },
        };
    }

    return {
        data: {
            firstName: data.first_name ?? "",
            lastName: data.last_name ?? "",
            userId: data.user_id,
        },
        error: null,
    };
};

const getErrorMessage = (error: ProfileNameError): string => {
    let errorMessage: string = "";
    switch (error.type) {
        case "failedProfileFetch":
            errorMessage = "Failed to fetch profile data.";
            break;
    }
    return `${errorMessage} Log ID: ${error.logId}`;
};

const ProfileNameComponent: React.FC<ProfileNameDetails> = ({ firstName, lastName, userId }) => (
    <TextValueContainer>{displayProfileName(firstName, lastName, userId)}</TextValueContainer>
);

const ProfileName: React.FC<{ profileId: string }> = ({ profileId }) => (
    <AuditLogModalRow<ProfileNameDetails, ProfileNameError>
        foreignKey={profileId}
        fetchResponse={fetchEventName}
        getErrorMessage={getErrorMessage}
        RowComponentWhenSuccessful={ProfileNameComponent}
        header="profile"
    />
);

export default ProfileName;
