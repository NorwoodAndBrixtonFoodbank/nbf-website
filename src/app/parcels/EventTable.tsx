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
    const [eventsDataPortion, setEventsDataPortion] = useState<EventTableRow[]>([]);

    const eventsTableColumnDisplayFunctions = {
        timestamp: formatDatetimeAsDatetime,
    };

    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const startPoint = (currentPage - 1) * perPage;
    const endPoint = currentPage * perPage - 1;

    useEffect(() => {
        setEventsDataPortion(getEventsData(props.tableData, startPoint, endPoint));
    }, [props.tableData, startPoint, endPoint]);

    return (
        <>
            <TableSurface>
                <Table
                    dataPortion={eventsDataPortion}
                    setDataPortion={setEventsDataPortion}
                    totalRows={props.tableData.length}
                    onPageChange={setCurrentPage}
                    onPerPageChage={setPerPage}
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
