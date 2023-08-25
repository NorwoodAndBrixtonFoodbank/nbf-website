"use client";

import Table, { TableHeaders } from "@/components/Tables/Table";
import TableSurface from "@/components/Tables/TableSurface";
import React from "react";
import { useRouter } from "next/navigation";

export interface ClientsTableRow {
    primaryKey: string;
    fullName: string;
    familyCategory: string;
    addressPostcode: string;
}

interface Props {
    data: ClientsTableRow[];
}

const headers: TableHeaders<ClientsTableRow> = [
    ["fullName", "Name"],
    ["familyCategory", "Family"],
    ["addressPostcode", "Postcode"],
];

const ClientsPage: React.FC<Props> = ({ data }) => {
    const router = useRouter();

    return (
        <TableSurface>
            <Table
                data={data}
                headerKeysAndLabels={headers}
                onRowClick={(row) => router.push(`/clients/${row.data.primaryKey}`)}
                sortable={["fullName", "familyCategory", "addressPostcode"]}
                pagination
                checkboxes={false}
                filters={["fullName"]}
            />
        </TableSurface>
    );
};

export default ClientsPage;
