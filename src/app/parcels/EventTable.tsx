"use client";

import React from "react";
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

const EventTable: React.FC<EventTableProps> = (props) => {
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
                    checkboxConfig={{displayed:false}}
                />
            </TableSurface>
        </>
    );
};

export default EventTable;
