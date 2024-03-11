"use client";

import React, { useEffect, useState } from "react";
import Table, { TableHeaders } from "@/components/Tables/Table";
import TableSurface from "@/components/Tables/TableSurface";
import { useRouter } from "next/navigation";

export interface ClientParcelTableRow {
    parcelId: string;
    voucherNumber: string;
    packingDate: string;
    collectionCentre: string;
}

const headers: TableHeaders<ClientParcelTableRow> = [
    ["voucherNumber", "Voucher Number"],
    ["packingDate", "Packing Date"],
    ["collectionCentre", "Collection"],
];

export interface ClientParcelTableProps {
    parcelsData: ClientParcelTableRow[];
}

const getClientsParcelData = (tableData: ClientParcelTableRow[], start: number, end: number) => (tableData.slice(start,end))

const ClientParcelsTable: React.FC<ClientParcelTableProps> = (props) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [clientsParcelsDataPortion, setClientsParcelsDataPortion] = useState<ClientParcelTableRow[]>([]);

    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const startpoint = (currentPage - 1) * perPage;
    const endpoint = (currentPage) * perPage - 1;

    const fetchData = () => {
        setClientsParcelsDataPortion(getClientsParcelData(props.parcelsData, startpoint, endpoint));
    }
    useEffect(()=>{
        fetchData();
    },[perPage,currentPage])
    const router = useRouter();
    return (
        <TableSurface>
            <Table
                    dataPortion={clientsParcelsDataPortion}
                    setDataPortion={setClientsParcelsDataPortion}
                    totalRows={props.parcelsData.length}
                    onPageChange={setCurrentPage}
                    onPerPageChage={setPerPage}
                    headerKeysAndLabels={headers}
                    pagination
            />
        </TableSurface>
    );
};

export default ClientParcelsTable;

