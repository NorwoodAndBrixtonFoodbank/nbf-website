"use client";

import React, { useEffect, useState } from "react";
import Table, { TableHeaders } from "@/components/Tables/Table";
import TableSurface from "@/components/Tables/TableSurface";

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
    tableData: EventTableRow[];
}

const formatDatetimeAsDatetime = (datetime: Date): string => {
    return datetime.toLocaleString("en-GB");
};

const getEventsData = (tableData: EventTableRow[], start: number, end: number): EventTableRow[] =>
    tableData.slice(start, end);

const EventTable: React.FC<EventTableProps> = (props) => {

    const eventsTableColumnDisplayFunctions = {
        timestamp: formatDatetimeAsDatetime,
    };


    return (
        <>
            <TableSurface>
                <Table
                    dataPortion={props.tableData}
                    headerKeysAndLabels={eventsTableHeaderKeysAndLabels}
                    columnDisplayFunctions={eventsTableColumnDisplayFunctions}
                    defaultShownHeaders={defaultShownHeaders}
                    checkboxConfig={{ displayed: false }}
                    filterConfig={{primaryFiltersShown: false, additionalFiltersShown: false}}
                    sortConfig={{sortShown: false}}
                    paginationConfig={{pagination: false}}
                    editableConfig={{editable: false}}
                />
            </TableSurface>
        </>
    );
};

export default EventTable;
