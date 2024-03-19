"use client";

import React from "react";
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

const ClientParcelsTable: React.FC<ClientParcelTableProps> = (props) => {
    const router = useRouter();
    return (
        <TableSurface>
            <Table
                data={props.parcelsData}
                headerKeysAndLabels={headers}
                pagination
                onRowClick={(row) => router.push(`/parcels?parcelId=${row.data.parcelId}`)}
                checkboxConfig={{ displayed: false }}
                pointerOnHover={true}
            />
        </TableSurface>
    );
};

export default ClientParcelsTable;
