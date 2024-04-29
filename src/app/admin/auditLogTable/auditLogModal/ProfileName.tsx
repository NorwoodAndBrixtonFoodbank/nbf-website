"use client";

import React from "react";
import supabase from "@/supabaseClient";
import { logErrorReturnLogId } from "@/logger/logger";
import { TextValueContainer } from "./AuditLogModal";
import { ForeignResponse } from "./types";
import GeneralForeignInfo from "./GeneralForeignInfo";

interface ProfileName {
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
): Promise<ForeignResponse<ProfileName, ProfileNameError>> => {
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

    return { data: {firstName: data.first_name ?? "", lastName: data.last_name ?? "", userId: data.user_id}, error: null };
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

const ProfileNameComponent: React.FC<ProfileName> = ({ firstName, lastName, userId }) => (
    <TextValueContainer>{userId === null ? "Deleted User" : `${firstName} ${lastName}`}</TextValueContainer>
);

const ProfileName: React.FC<{ profileId: string }> = ({ profileId }) => (
    <GeneralForeignInfo<ProfileName, ProfileNameError>
        foreignKey={profileId}
        fetchResponse={fetchEventName}
        getErrorMessage={getErrorMessage}
        SpecificInfoComponent={ProfileNameComponent}
        header="profile"
    />
);

export default ProfileName;