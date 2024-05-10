import React from "react";
import { formatDateTime, formatDatetimeAsDate, nullPostcodeDisplay } from "@/common/format";
import { GetParcelDataAndCountErrorType, ParcelsTableRow } from "./types";
import CongestionChargeAppliesIcon from "@/components/Icons/CongestionChargeAppliesIcon";
import DeliveryIcon from "@/components/Icons/DeliveryIcon";
import FlaggedForAttentionIcon from "@/components/Icons/FlaggedForAttentionIcon";
import PhoneIcon from "@/components/Icons/PhoneIcon";
import CollectionIcon from "@/components/Icons/CollectionIcon";
import { useTheme } from "styled-components";

const RowToIconsColumn = ({
    flaggedForAttention,
    requiresFollowUpPhoneCall,
}: ParcelsTableRow["iconsColumn"]): React.ReactElement => {
    const theme = useTheme();
    return (
        <>
            {flaggedForAttention && <FlaggedForAttentionIcon />}
            {requiresFollowUpPhoneCall && <PhoneIcon color={theme.main.largeForeground[0]} />}
        </>
    );
};

const RowToDeliveryCollectionColumn = (
    collectionData: ParcelsTableRow["deliveryCollection"]
): React.ReactElement => {
    const theme = useTheme();
    const { collectionCentreName, collectionCentreAcronym, congestionChargeApplies } =
        collectionData;
    if (collectionCentreName === "Delivery") {
        return (
            <>
                <DeliveryIcon color={theme.main.largeForeground[0]} />
                {congestionChargeApplies && <CongestionChargeAppliesIcon />}
            </>
        );
    }

    return (
        <>
            <CollectionIcon
                color={theme.main.largeForeground[0]}
                collectionPoint={collectionCentreName}
            />
            {collectionCentreAcronym}
        </>
    );
};

const rowToLastStatusColumn = (data: ParcelsTableRow["lastStatus"] | null): string => {
    if (!data) {
        return "";
    }
    const { name, eventData, timestamp } = data;
    return (
        `${name}` + (eventData ? ` (${eventData})` : "") + ` @ ${formatDatetimeAsDate(timestamp)}`
    );
};

const formatNullPostcode = (postcodeData: ParcelsTableRow["addressPostcode"]): string => {
    return postcodeData ?? nullPostcodeDisplay;
};

export const parcelTableColumnDisplayFunctions = {
    iconsColumn: RowToIconsColumn,
    deliveryCollection: RowToDeliveryCollectionColumn,
    packingDate: formatDatetimeAsDate,
    lastStatus: rowToLastStatusColumn,
    addressPostcode: formatNullPostcode,
    createdAt: formatDateTime,
};

export const getParcelDataErrorMessage = (
    errorType: GetParcelDataAndCountErrorType
): string | null => {
    switch (errorType) {
        case "unknownError":
            return "Unknown error has occurred. Please reload.";
        case "failedToFetchParcels":
            return "Failed to fetch parcels. Please reload.";
        case "abortedFetch":
            return null;
    }
};

export const getSelectedParcelCountMessage = (numberOfSelectedParcels: number): string | null => {
    if (numberOfSelectedParcels === 0) {
        return null;
    }
    return numberOfSelectedParcels === 1
        ? "1 parcel selected"
        : `${numberOfSelectedParcels} parcels selected`;
};
