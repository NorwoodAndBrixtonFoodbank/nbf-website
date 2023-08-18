"use client";

import React from "react";
import { ClientsTableRow } from "@/app/clients/getClientsTableData";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PopUpButton from "@/components/Buttons/PopUpButton";
import LinkButton from "@/components/Buttons/LinkButton";
import Button from "@mui/material/Button";
import TableSurface from "@/components/Tables/TableSurface";
import Table, { TableHeaders } from "@/components/Tables/Table";
import styled from "styled-components";

interface Props {
    data: ClientsTableRow[];
}

const PopUp = styled.div`
    display: flex;
    flex-direction: column;
    text-align: center;
    padding: 2rem;
`;

const headers: TableHeaders = [
    ["fullName", "Name"],
    ["familyCategory", "Family"],
    ["addressPostcode", "Postcode"],
];

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

const AddParcelsButton: React.FC<Props> = ({ data }) => {
    const [existingClientsView, setExistingClientsView] = useState(false);
    const router = useRouter();

    return (
        <PopUpButton displayText="Add Parcel">
            <>
                {!existingClientsView ? (
                    <PopUp>
                        <LinkButton link="/clients/add">New Client</LinkButton>
                        <Button onClick={() => setExistingClientsView(true)}>
                            Existing Client
                        </Button>
                    </PopUp>
                ) : (
                    <>
                        <TableSurface>
                            <Table
                                data={data}
                                headerKeysAndLabels={headers}
                                onRowClick={(row) => router.push(`/clients/${row.data.primaryKey}`)}
                                sortable={true}
                                pagination={false}
                                checkboxes={false}
                                columnStyleOptions={styleOptions}
                                headerFilters={["fullName"]}
                            />
                        </TableSurface>
                        <Button onClick={() => setExistingClientsView(false)}>Back</Button>
                    </>
                )}
            </>
        </PopUpButton>
    );
};

export default AddParcelsButton;
