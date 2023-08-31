"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { Schema } from "@/databaseUtils";
import PopUpButton from "@/components/Buttons/PopUpButton";
import LinkButton from "@/components/Buttons/LinkButton";
import Button from "@mui/material/Button";
import TableSurface from "@/components/Tables/TableSurface";
import Table, { TableHeaders } from "@/components/Tables/Table";
import { ParcelsTableRow } from "@/app/clients/getClientsTableData";

interface Props {
    data: ParcelsTableRow[];
}

interface ClientsTableRow {
    primaryKey: string;
    fullName: Schema["clients"]["full_name"];
    familyCategory: number;
    addressPostcode: Schema["clients"]["address_postcode"];
}

const PopUp = styled.div`
    display: flex;
    flex-direction: column;
    text-align: center;
    padding: 2rem;
`;

const styleOptions = {
    fullName: {
        minWidth: "8rem",
    },
    familyCategory: {
        hide: 550,
    },
    addressPostcode: {
        hide: 800,
    },
};

const headers: TableHeaders<ClientsTableRow> = [
    ["fullName", "Name"],
    ["familyCategory", "Family"],
    ["addressPostcode", "Postcode"],
];

const showClients = (data: ParcelsTableRow[]): ClientsTableRow[] => {
    const primaryKeys: string[] = [];
    const clientsData: ClientsTableRow[] = [];

    for (const datum of data) {
        if (!primaryKeys.includes(datum.primaryKey)) {
            const { primaryKey, fullName, familyCategory, addressPostcode } = datum;
            clientsData.push({ primaryKey, fullName, familyCategory, addressPostcode });
            primaryKeys.push(datum.primaryKey);
        }
    }

    return clientsData;
};

const AddParcelsButton: React.FC<Props> = ({ data }) => {
    const [existingClientsView, setExistingClientsView] = useState(false);
    const router = useRouter();

    const clientData = showClients(data);

    return (
        <PopUpButton displayText="Add Parcel">
            {existingClientsView ? (
                <>
                    <TableSurface>
                        <Table
                            data={clientData}
                            headerKeysAndLabels={headers}
                            onRowClick={(row) => router.push(`/clients/${row.data.primaryKey}`)}
                            sortable={["addressPostcode", "familyCategory", "fullName"]}
                            pagination
                            checkboxes={false}
                            columnStyleOptions={styleOptions}
                            filters={["fullName"]}
                        />
                    </TableSurface>
                    <Button onClick={() => setExistingClientsView(false)}>Back</Button>
                </>
            ) : (
                <PopUp>
                    <LinkButton link="/clients/add">New Client</LinkButton>
                    <Button onClick={() => setExistingClientsView(true)}>Existing Client</Button>
                </PopUp>
            )}
        </PopUpButton>
    );
};

export default AddParcelsButton;
