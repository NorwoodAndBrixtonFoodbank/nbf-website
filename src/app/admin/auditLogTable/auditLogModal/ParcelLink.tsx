import React, { useEffect, useState } from "react";
import supabase from "@/supabaseClient";
import { logErrorReturnLogId } from "@/logger/logger";
import LinkButton from "@/components/Buttons/LinkButton";
import { AuditLogModalItem, ErrorContainer, Key, LinkContainer } from "./AuditLogModal";
import dayjs from "dayjs";
import { ErrorSecondaryText } from "@/app/errorStylingandMessages";

interface ParcelLinkProps {
    parcelId: string;
}

interface ParcelOverviewDetails {
    collectionDatetime: Date | null;
    fullName: string;
    addressPostcode: string;
}

type ParcelOverviewDetailsResponse =
    | {
          parcelOverviewDetails: ParcelOverviewDetails;
          error: null;
      }
    | {
          parcelOverviewDetails: null;
          error: ParcelOverviewDetailsError;
      };

type ParcelOverviewDetailsErrorType = "failedParcelOverviewDetailsFetch" | "nullClient";
interface ParcelOverviewDetailsError {
    type: ParcelOverviewDetailsErrorType;
    logId: string;
}

const fetchParcelOverviewDetails = async (
    parcelId: string
): Promise<ParcelOverviewDetailsResponse> => {
    const { data: data, error } = await supabase
        .from("parcels")
        .select("primary_key, client:clients(full_name, address_postcode), collection_datetime")
        .eq("primary_key", parcelId)
        .limit(1, { foreignTable: "clients" })
        .single();
    if (error) {
        const logId = await logErrorReturnLogId("Error with fetch: parcels", { error: error });
        return {
            parcelOverviewDetails: null,
            error: { type: "failedParcelOverviewDetailsFetch", logId: logId },
        };
    }
    if (data.client === null) {
        const logId = await logErrorReturnLogId("Error with fetch: parcels. Client null", {
            error: error,
        });
        return { parcelOverviewDetails: null, error: { type: "nullClient", logId: logId } };
    }
    const convertedData = {
        collectionDatetime: data.collection_datetime ? new Date(data.collection_datetime) : null,
        fullName: data.client.full_name,
        addressPostcode: data.client.address_postcode,
    };
    return { parcelOverviewDetails: convertedData, error: null };
};

const getErrorMessage = (error: ParcelOverviewDetailsError): string => {
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

const ParcelLink: React.FC<ParcelLinkProps> = ({ parcelId }) => {
    const [parcelOverviewDetails, setParcelOverviewDetails] =
        useState<ParcelOverviewDetails | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            const { parcelOverviewDetails, error } = await fetchParcelOverviewDetails(parcelId);
            if (error) {
                setErrorMessage(getErrorMessage(error));
                return;
            }
            setParcelOverviewDetails(parcelOverviewDetails);
        })();
    }, [parcelId]);

    return (
        <AuditLogModalItem>
            <Key>PARCEL: </Key>
            {parcelOverviewDetails && (
                <LinkContainer>
                    <LinkButton link={`/parcels?parcelId=${parcelId}`}>
                        {parcelOverviewDetails.addressPostcode}
                        {parcelOverviewDetails.fullName && ` - ${parcelOverviewDetails.fullName}`}
                        {parcelOverviewDetails.collectionDatetime &&
                            ` @ ${dayjs(parcelOverviewDetails.collectionDatetime!).format("DD/MM/YYYY HH:mm")}`}
                    </LinkButton>
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

export default ParcelLink;
