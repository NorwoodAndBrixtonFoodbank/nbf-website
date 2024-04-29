"use client";

import React from "react";
import supabase from "@/supabaseClient";
import { logErrorReturnLogId } from "@/logger/logger";
import LinkButton from "@/components/Buttons/LinkButton";
import { LinkContainer } from "./AuditLogModal";
import dayjs from "dayjs";
import GeneralForeignInfo from "./GeneralForeignInfo";
import { ForeignResponse } from "./types";

interface ParcelLinkDetails {
    parcelId: string;
    collectionDatetime: Date | null;
    fullName: string;
    addressPostcode: string;
}

type ParcelLinkErrorType = "failedParcelOverviewDetailsFetch" | "nullClient";
interface ParcelLinkError {
    type: ParcelLinkErrorType;
    logId: string;
}

const fetchParcelLinkDetails = async (
    parcelId: string
): Promise<ForeignResponse<ParcelLinkDetails, ParcelLinkError>> => {
    const { data: data, error } = await supabase
        .from("parcels")
        .select("primary_key, client:clients(full_name, address_postcode), collection_datetime")
        .eq("primary_key", parcelId)
        .limit(1, { foreignTable: "clients" })
        .single();

    if (error) {
        const logId = await logErrorReturnLogId("Error with fetch: parcels", { error: error });
        return {
            data: null,
            error: { type: "failedParcelOverviewDetailsFetch", logId: logId },
        };
    }

    if (data.client === null) {
        const logId = await logErrorReturnLogId("Error with fetch: parcels. Client null", {
            error: error,
        });
        return { data: null, error: { type: "nullClient", logId: logId } };
    }

    const convertedData = {
        parcelId: data.primary_key,
        collectionDatetime: data.collection_datetime ? new Date(data.collection_datetime) : null,
        fullName: data.client.full_name,
        addressPostcode: data.client.address_postcode,
    };

    return { data: convertedData, error: null };
};

const getErrorMessage = (error: ParcelLinkError): string => {
    let errorMessage: string = "";
    switch (error.type) {
        case "failedParcelOverviewDetailsFetch":
            errorMessage = "Failed to fetch parcel details.";
            break;
        case "nullClient":
            errorMessage = "No associated client found for the selected parcel.";
            break;
    }
    return `${errorMessage} Log ID: ${error.logId}`;
};

const GeneralParcelLink: React.FC<ParcelLinkDetails> = ({
    parcelId,
    fullName,
    addressPostcode,
    collectionDatetime,
}) => (
    <LinkContainer>
        <LinkButton link={`/parcels?parcelId=${parcelId}`}>
            {addressPostcode}
            {fullName && ` - ${fullName}`}
            {collectionDatetime && ` @ ${dayjs(collectionDatetime!).format("DD/MM/YYYY HH:mm")}`}
        </LinkButton>
    </LinkContainer>
);

export const ParcelLink: React.FC<{ parcelId: string }> = ({ parcelId }) => (
    <GeneralForeignInfo<ParcelLinkDetails, ParcelLinkError>
        foreignKey={parcelId}
        fetchResponse={fetchParcelLinkDetails}
        getErrorMessage={getErrorMessage}
        SpecificInfoComponent={GeneralParcelLink}
        header="parcel"
    />
);
