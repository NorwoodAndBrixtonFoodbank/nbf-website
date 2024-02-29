"use client";

import React from "react";
import Table, { TableHeaders } from "@/components/Tables/Table";
import TableSurface from "@/components/Tables/TableSurface";
// import { ParcelsTableRow } from "@/app/parcels/getParcelsTableData";
// import DeliveryIcon from "@/components/Icons/DeliveryIcon";
// import CongestionChargeAppliesIcon from "@/components/Icons/CongestionChargeAppliesIcon";
// import CollectionIcon from "@/components/Icons/CollectionIcon";
// import { useTheme } from "styled-components";
// import { formatDatetimeAsDate } from "@/app/parcels/getExpandedParcelDetails";

export interface ClientParcelTableRow {
    parcelId: string;
    voucherNumber: string;
    packingDate: string;
    packingTime: string;
    collectionCentre: string;
}

const headers: TableHeaders<ClientParcelTableRow> = [
    ["voucherNumber", "Voucher Number"],
    ["packingDate", "Packing Date"],
    ["collectionCentre", "Collection"],
];

export interface ClientParcelTableProps {
    tableData: ClientParcelTableRow[];
}

// const formatDatetimeAsDatetime = (datetime: Date): string => {
//     return datetime.toLocaleString("en-GB");
// };

const ClientParcelsTable: React.FC<ClientParcelTableProps> = (props) => {
    return (
        <>
            <TableSurface>
                <Table
                    data={props.tableData}
                    headerKeysAndLabels={headers}
                    pagination
                    onRowClick={(row) => console.log(row.data.parcelId)}
                />
            </TableSurface>
        </>
    );
};

export default ClientParcelsTable;
