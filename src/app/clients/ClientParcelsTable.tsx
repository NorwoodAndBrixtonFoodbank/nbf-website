"use client";

import React from "react";
import { ClientPaginatedTable, TableHeaders } from "@/components/Tables/Table";
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
    ["collectionCentre", "Method"],
];

export interface ClientParcelTableProps {
    parcelsData: ClientParcelTableRow[];
}

const ClientParcelsTable: React.FC<ClientParcelTableProps> = (props) => {
    const router = useRouter();
    return (
        <TableSurface>
            <ClientPaginatedTable
                dataPortion={props.parcelsData}
                headerKeysAndLabels={headers}
                paginationConfig={{ enablePagination: false }}
                sortConfig={{ sortPossible: false }}
                filterConfig={{
                    primaryFiltersShown: false,
                    additionalFiltersShown: false,
                    listChoiceButton: false,
                }}
                onRowClick={(row) => router.push(`/parcels?parcelId=${row.data.parcelId}`)}
                checkboxConfig={{ displayed: false }}
                editableConfig={{ editable: false }}
                pointerOnHover={true}
            />
        </TableSurface>
    );
};

export default ClientParcelsTable;
