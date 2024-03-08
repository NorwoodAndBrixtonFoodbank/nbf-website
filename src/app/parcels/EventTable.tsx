"use client";

import React, { useState } from "react";
import Table, { TableHeaders } from "@/components/Tables/Table";
import TableSurface from "@/components/Tables/TableSurface";
import { Supabase } from "@/supabaseUtils";
import supabase from "@/supabaseClient";

export interface EventTableRow {
    eventInfo: string;
    timestamp: Date;
}

export const eventsTableHeaderKeysAndLabels: TableHeaders<EventTableRow> = [
    ["eventInfo", "Event"],
    ["timestamp", "Timestamp"],
];

const defaultShownHeaders: (keyof EventTableRow)[] = ["eventInfo", "timestamp"];

export interface EventTableProps {
    getEventTableData: (supabase: Supabase, start: number, end: number) => Promise<EventTableRow[]>,
    getEventTableCount: (supabase: Supabase) => Promise<number>
}

const formatDatetimeAsDatetime = (datetime: Date): string => {
    return datetime.toLocaleString("en-GB");
};

const EventTable: React.FC<EventTableProps> = (props) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const eventsTableColumnDisplayFunctions = {
        timestamp: formatDatetimeAsDatetime
    };

    return (
        <>
            <TableSurface>
                <Table
                    getData={props.getEventTableData}
                    getCount={props.getEventTableCount}
                    headerKeysAndLabels={eventsTableHeaderKeysAndLabels}
                    columnDisplayFunctions={eventsTableColumnDisplayFunctions}
                    pagination
                    defaultShownHeaders={defaultShownHeaders}
                    supabase={supabase}
                    loading={isLoading}
                    setLoading={setIsLoading}
                />
            </TableSurface>
        </>
    );
};

export default EventTable;
