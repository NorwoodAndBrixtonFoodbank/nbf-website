"use client";

import React from "react";
import { ClientsTableRow } from "@/app/clients/getClientsTableData";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PopUpButton from "@/components/Buttons/PopUpButton";
import LinkButton from "@/components/Buttons/LinkButton";
import Button from "@mui/material/Button";
import TableSurface from "@/components/Tables/TableSurface";
import Table, { Datum, TableHeaders } from "@/components/Tables/Table";
import styled from "styled-components";
import { Schema } from "@/database_utils";

interface Props {
    data: ClientsTableRow[];
}

interface ClientsListRow extends Datum {
    primaryKey: string;
    fullName: Schema["clients"]["full_name"];
    familyCategory: string;
    addressPostcode: Schema["clients"]["address_postcode"];
}

const headers: TableHeaders = [
    ["fullName", "Name"],
    ["familyCategory", "Family"],
    ["addressPostcode", "Postcode"],
];

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

const showClients = (data: ClientsTableRow[]): ClientsListRow[] => {
    const primaryKeys: string[] = [];
    const clientsData: ClientsListRow[] = [];

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
            {!existingClientsView ? (
                <PopUp>
                    <LinkButton link="/clients/add">New Client</LinkButton>
                    <Button onClick={() => setExistingClientsView(true)}>Existing Client</Button>
                </PopUp>
            ) : (
                <>
                    <TableSurface>
                        <Table
                            data={clientData}
                            headerKeysAndLabels={headers}
                            onRowClick={(row) => router.push(`/clients/${row.data.primaryKey}`)}
                            sortable
                            pagination
                            checkboxes={false}
                            columnStyleOptions={styleOptions}
                            headerFilters={["fullName"]}
                        />
                    </TableSurface>
                    <Button onClick={() => setExistingClientsView(false)}>Back</Button>
                </>
            )}
        </PopUpButton>
    );
};

export default AddParcelsButton;
