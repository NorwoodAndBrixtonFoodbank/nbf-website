"use client";

import getExpandedClientDetails, {
    ExpandedClientDetails,
} from "@/app/clients/getExpandedClientDetails";
import LinkButton from "@/components/Buttons/LinkButton";
import DataViewer from "@/components/DataViewer/DataViewer";
import Icon from "@/components/Icons/Icon";
import Modal from "@/components/Modal/Modal";
import Table, { TableHeaders } from "@/components/Tables/Table";
import TableSurface from "@/components/Tables/TableSurface";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";
import styled, { useTheme } from "styled-components";

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

const Centerer = styled.div`
    display: flex;
    justify-content: center;
`;

const ClientsPage: React.FC<Props> = ({ data }) => {
    const theme = useTheme();
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const [activeData, setActiveData] = useState<ExpandedClientDetails | null>(null);

    return (
        <>
            <TableSurface>
                <Table
                    data={data}
                    headerKeysAndLabels={headers}
                    onRowClick={(row) =>
                        getExpandedClientDetails(row.data.primaryKey).then((data) => {
                            setModalIsOpen(true);
                            setActiveData(data);
                        })
                    }
                    sortable={["fullName", "familyCategory", "addressPostcode"]}
                    pagination
                    checkboxes={false}
                    filters={["fullName"]}
                />
            </TableSurface>
            <Centerer>
                <LinkButton link="/clients/add">Add Client</LinkButton>
            </Centerer>

            <Modal
                header={
                    <>
                        <Icon icon={faUser} color={theme.primary.largeForeground[2]} />
                        Client Details
                    </>
                }
                isOpen={modalIsOpen}
                onClose={() => setModalIsOpen(false)}
                headerId="clientsDetailModal"
            >
                <Centerer>
                    <LinkButton link={`/clients/edit/${activeData?.primaryKey}`}>
                        Edit Client
                    </LinkButton>
                    <LinkButton link={`/parcels/add/${activeData?.primaryKey}`}>
                        Add Parcel
                    </LinkButton>
                </Centerer>
                <DataViewer data={activeData ?? {}} />
            </Modal>
        </>
    );
};

export default ClientsPage;
