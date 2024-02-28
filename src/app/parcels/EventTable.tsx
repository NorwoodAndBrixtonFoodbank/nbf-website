"use client";

import React from "react";
import Table, {TableHeaders } from "@/components/Tables/Table";
import styled, { useTheme } from "styled-components";
import { formatDatetimeAsDate, formatDatetimeAsTime } from "@/app/parcels/getExpandedParcelDetails";
import TableSurface from "@/components/Tables/TableSurface";
import { Schema } from "@/databaseUtils";

export interface EventTableRow {
    eventName: string;
    timestamp: Date;
    eventData: string | null;
}

export const eventsTableHeaderKeysAndLabels: TableHeaders<EventTableRow> = [
    ["eventName", "Name"],
    ["timestamp", "Timestamp"],
    ["eventData", "Event Data"]
];

const defaultShownHeaders: (keyof EventTableRow)[] = [
    "eventName",
    "timestamp",
    "eventData"
];

export interface EventTableProps {
    tableData: EventTableRow[]
}

const formatDatetimeAsDatetime = (datetime: Date): string => {
    return datetime.toLocaleString("en-GB");
};

const EventTable: React.FC<EventTableProps> = (props) => {
    const theme = useTheme();

    const eventsTableColumnDisplayFunctions = {
        timestamp: formatDatetimeAsDatetime,
    };

    return (
        <>
            <TableSurface>
                <Table
                    data={props.tableData}
                    headerKeysAndLabels={eventsTableHeaderKeysAndLabels}
                    columnDisplayFunctions={eventsTableColumnDisplayFunctions}
                    pagination
                    defaultShownHeaders={defaultShownHeaders}
                />
            </TableSurface>
        </>
    );
};

export default EventTable;
