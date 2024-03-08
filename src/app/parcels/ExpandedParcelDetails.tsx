import React from "react";
import DataViewer from "@/components/DataViewer/DataViewer";
import getExpandedParcelDetails, { processEventsDetails } from "@/app/parcels/getExpandedParcelDetails";
import EventTable, { EventTableRow } from "./EventTable";
import { Supabase } from "@/supabaseUtils";
import { DatabaseError } from "../errorClasses";
import { extractValidationProps } from "@mui/x-date-pickers/internals";

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

    const getEventTableDataForThisParcel = async (supabase: Supabase, start: number, end: number, ): Promise<EventTableRow[]> => {
        const { data, error } = await supabase
            .from("events")
            .select(
                `
                event_name,
                timestamp,
                event_data
        `
            )
            .eq("parcel_id", parcelId)
            .order("timestamp", {ascending: false})
            .range(start, end);
        if (error) {
            throw new DatabaseError("fetch", "client data");
        }
        return processEventsDetails(data);
    }
        const getEventTableCountForThisParcel = async (supabase: Supabase): Promise<number> => {
            const { count, error } = await supabase
                .from("events")
                .select(
                    `
                    *
            `
                , {count: "exact", head: true})
                .eq("parcel_id", parcelId)
            if (error || count === null) {
                throw new DatabaseError("fetch", "client data");
            }
            return count;
    };

    return (
        <>
            <DataViewer data={expandedParcelDetails.expandedParcelData} />
            <EventTable
                getEventTableData= {getEventTableDataForThisParcel}
                getEventTableCount= {getEventTableCountForThisParcel}
            />
        </>
    );
};

export default ExpandedParcelDetails;
