"use client";

import React, { Suspense, useState } from "react";
import Table, { Row, TableHeaders } from "@/components/Tables/Table";

import styled from "styled-components";
import { ClientsTableRow } from "@/app/clients/getClientsTableData";
import FlaggedForAttentionIcon from "@/components/Icons/FlaggedForAttentionIcon";
import PhoneIcon from "@/components/Icons/PhoneIcon";
import CongestionChargeAppliesIcon from "@/components/Icons/CongestionChargeAppliesIcon";
import DeliveryIcon from "@/components/Icons/DeliveryIcon";
import CollectionIcon from "@/components/Icons/CollectionIcon";
import ExpandedClientDetails from "@/app/clients/ExpandedClientDetails";
import ExpandedClientDetailsFallback from "@/app/clients/ExpandedClientDetailsFallback";
import Icon from "@/components/Icons/Icon";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import Modal from "@/components/Modal/Modal";
import { Schema } from "@/supabase";
import { Paper } from "@mui/material";

const ClientsTablePaper = styled(Paper)`
    margin: 1rem;
    padding: 1rem;
    border-radius: 1rem;
    background-color: ${(props) => props.theme.surfaceBackgroundColor};
`;

const rowToIconsColumn = (row: Row): React.ReactElement => {
    const data = row.data as ClientsTableRow;

    return (
        <>
            {data.flaggedForAttention ? <FlaggedForAttentionIcon /> : <></>}
            {data.requiresFollowUpPhoneCall ? <PhoneIcon /> : <></>}
        </>
    );
};

const rowToDeliveryCollectionColumn = (row: Row): React.ReactElement => {
    const data = row.data as ClientsTableRow;

    if (data.collectionCentre === "Delivery") {
        return (
            <>
                <DeliveryIcon />
                {data.congestionChargeApplies ? <CongestionChargeAppliesIcon /> : <></>}
            </>
        );
    }

    return (
        <>
            <CollectionIcon collectionPoint={data.collectionCentre} />
            {collectionCentreToAbbreviation(data.collectionCentre)}
        </>
    );
};

const collectionCentreToAbbreviation = (
    collectionCentre: Schema["parcels"]["collection_centre"]
): string => {
    switch (collectionCentre) {
        case "Brixton Hill - Methodist Church":
            return "BH-MC";
        case "Clapham - St Stephens Church":
            return "CLP-SC";
        case "N&B - Emmanuel Church":
            return "NAB-EC";
        case "Streatham - Immanuel & St Andrew":
            return "STM-IS";
        case "Vauxhall Hope Church":
            return "VHC";
        case "Waterloo - Oasis":
            return "WAT-OA";
        case "Waterloo - St George the Martyr":
            return "WAT-SG";
        case "Waterloo - St Johns":
            return "WAT-SJ";
        default:
            return "-";
    }
};

export const clientTableHeaderKeysAndLabels: TableHeaders = [
    ["iconsColumn", ""],
    ["fullName", "Name"],
    ["familyCategory", "Family"],
    ["addressPostcode", "Postcode"],
    ["deliveryCollection", ""],
    ["packingDate", "Packing Date"],
    ["packingTimeLabel", "Time"],
    ["lastStatus", "Last Status"],
];

const toggleableHeaders = [
    "fullName",
    "familyCategory",
    "addressPostcode",
    "packingDate",
    "packingTimeLabel",
    "lastStatus",
];

const clientTableColumnDisplayFunctions = {
    iconsColumn: rowToIconsColumn,
    deliveryCollection: rowToDeliveryCollectionColumn,
};

const clientTableColumnStyleOptions = {
    iconsColumn: {
        grow: 0,
    },
    fullName: {},
    familyCategory: {
        hide: 550,
    },
    addressPostcode: {
        hide: 800,
        maxWidth: "12rem",
    },
    deliveryCollection: {
        grow: 0,
        minWidth: "6rem",
    },
    packingDate: {},
    packingTimeLabel: {
        grow: 0,
        hide: 800,
        minWidth: "6rem",
    },
    lastStatus: {
        hide: 800,
    },
};

interface Props {
    clientsTableData: ClientsTableRow[];
}

const ClientsPage: React.FC<Props> = (props) => {
    const [selectedParcelId, setSelectedParcelId] = useState<string | null>(null);

    const onClientTableRowClick = (row: Row): void => {
        const data = row.data as ClientsTableRow;
        setSelectedParcelId(data.parcelId);
    };

    const onExpandedClientDetailsClose = (): void => {
        setSelectedParcelId(null);
    };

    return (
        <>
            <ClientsTablePaper elevation={2}>
                <Table
                    data={props.clientsTableData}
                    headerKeysAndLabels={clientTableHeaderKeysAndLabels}
                    columnDisplayFunctions={clientTableColumnDisplayFunctions}
                    columnStyleOptions={clientTableColumnStyleOptions}
                    onRowClick={onClientTableRowClick}
                    checkboxes={true}
                    pagination={true}
                    sortable={true}
                    headerFilters={["addressPostcode"]}
                    toggleableHeaders={toggleableHeaders}
                />
            </ClientsTablePaper>
            <Modal
                header={
                    <>
                        <Icon icon={faUser} /> Client Details
                    </>
                }
                isOpen={selectedParcelId !== null}
                onClose={onExpandedClientDetailsClose}
                headerId="expandedClientDetailsModal"
            >
                <Suspense fallback={<ExpandedClientDetailsFallback />}>
                    <ExpandedClientDetails parcelId={selectedParcelId} />
                </Suspense>
            </Modal>
        </>
    );
};

export default ClientsPage;
