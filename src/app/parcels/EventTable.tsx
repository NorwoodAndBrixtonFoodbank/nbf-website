"use client";

import React, { useEffect, useState } from "react";
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
    tableData: EventTableRow[];
}

const formatDatetimeAsDatetime = (datetime: Date): string => {
    return datetime.toLocaleString("en-GB");
};

const getEventsData = (tableData: EventTableRow[], start: number, end: number) => (tableData.slice(start,end))

const EventTable: React.FC<EventTableProps> = (props) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [eventsDataPortion, setEventsDataPortion] = useState<EventTableRow[]>([]);

    const eventsTableColumnDisplayFunctions = {
        timestamp: formatDatetimeAsDatetime
    };

    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const startpoint = (currentPage - 1) * perPage;
    const endpoint = (currentPage) * perPage - 1;

    const fetchData = () => {
        setEventsDataPortion(getEventsData(props.tableData, startpoint, endpoint));
    }
    useEffect(()=>{
        fetchData();
    },[perPage,currentPage])


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
