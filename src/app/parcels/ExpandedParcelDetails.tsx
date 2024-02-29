import React from "react";
import DataViewer from "@/components/DataViewer/DataViewer";
import getExpandedParcelDetails from "@/app/parcels/getExpandedParcelDetails";
import EventTable, { EventTableRow } from "./EventTable";

interface Props {
    parcelId: string | null;
}

const sortByTimestampWithMostRecentFirst = (events: EventTableRow[]): EventTableRow[] => {
    return events.sort((eventA, eventB) => eventB.timestamp.getTime() - eventA.timestamp.getTime());
};

const ExpandedParcelDetails = async ({ parcelId }: Props): Promise<React.ReactElement> => {
    if (!parcelId) {
        return <></>;
    }
    const expandedParcelDetails = await getExpandedParcelDetails(parcelId);

    return (
        <>
            <DataViewer data={expandedParcelDetails.expandedParcelData} />
            <EventTable
                tableData={sortByTimestampWithMostRecentFirst(expandedParcelDetails.events)}
            />
        </>
    );
};

export default ExpandedParcelDetails;
