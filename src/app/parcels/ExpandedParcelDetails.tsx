"use client";

import React, { ReactElement, useCallback, useEffect, useState } from "react";
import DataViewer from "@/components/DataViewer/DataViewer";
import getExpandedParcelDetails, {
    ExpandedParcelDetails,
    FetchExpandedParcelDetailsError,
} from "@/app/parcels/getExpandedParcelDetails";
import EventTable, { EventTableRow } from "./EventTable";
import { ErrorLargeText } from "@/app/errorStylingandMessages";

interface Props {
    parcelId: string | null;
}

const sortByTimestampWithMostRecentFirst = (events: EventTableRow[]): EventTableRow[] => {
    return events.sort((eventA, eventB) => eventB.timestamp.getTime() - eventA.timestamp.getTime());
};

function getErrorMessageForExpandedParcelDetailsError(
    error: FetchExpandedParcelDetailsError
): string {
    switch (error.type) {
        case "failedToFetchParcelDetails":
            return `Failed to fetch parcel details. Log ID: ${error.logId}`;
        case "clientDetailDoesNotExist":
            return `Client detail cannot be found. Log ID: ${error.logId}`;
    }
}

const ExpandedParcelDetailsView = ({ parcelId }: Props): ReactElement => {
    const [parcelDetails, setParcelDetails] = useState<ExpandedParcelDetails | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const fetchAndSetParcelDetails = useCallback(async (): Promise<void> => {
        if (!parcelId) {
            return;
        }

        const { parcelDetails: expandedParcelDetails, error } =
            await getExpandedParcelDetails(parcelId);

        if (error) {
            const newErrorMessage = getErrorMessageForExpandedParcelDetailsError(error);
            setErrorMessage(newErrorMessage);
            return;
        }

        setParcelDetails(expandedParcelDetails);
    }, [parcelId]);

    useEffect(() => {
        void fetchAndSetParcelDetails();
    }, [fetchAndSetParcelDetails]);

    return (
        <>
            {errorMessage && <ErrorLargeText>{errorMessage}</ErrorLargeText>}

            {parcelDetails && (
                <>
                    <DataViewer data={parcelDetails.expandedParcelData} />
                    <EventTable
                        tableData={sortByTimestampWithMostRecentFirst(parcelDetails.events)}
                    />
                </>
            )}
        </>
    );
};

export default ExpandedParcelDetailsView;
