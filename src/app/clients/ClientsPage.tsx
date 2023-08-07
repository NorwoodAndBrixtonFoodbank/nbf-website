"use client";

import React, { Suspense, useState } from "react";
import Table, { Row, TableHeaders } from "@/components/Tables/Table";

import styled from "styled-components";
import { ClientsTableDatum, ClientsTableRow } from "@/app/clients/getClientsTableData";
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

const ClientsTableDiv = styled.div``;

const rowToIconsColumn = (row: Row): React.ReactElement => {
    const data = row.data as ClientsTableRow;

    return (
        <>
            {data.flaggedForAttention ? <FlaggedForAttentionIcon /> : <></>}
            {/*// TODO Change PhoneIcon support for Dark Mode*/}
            {data.requiresFollowUpPhoneCall ? <PhoneIcon /> : <></>}
        </>
    );
};

const rowToDeliveryCollectionColumn = (row: Row): React.ReactElement => {
    if (row.data.collectionCentre === "Delivery") {
        return (
            <>
                <DeliveryIcon />
                {row.data.congestionChargeApplies ? <CongestionChargeAppliesIcon /> : <> </>}
            </>
        );
    }

    return (
        <>
            <CollectionIcon collectionPoint={row.data.collectionCentre} />
            {collectionCentreToAbbreviation(row.data.collectionCentre)}
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

export const clientTableColumnDisplayFunctions = {
    iconsColumn: rowToIconsColumn,
    deliveryCollection: rowToDeliveryCollectionColumn,
};

interface Props {
    clientsTableData: ClientsTableDatum[];
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
            <ClientsTableDiv>
                <Table
                    data={props.clientsTableData}
                    headerKeysAndLabels={clientTableHeaderKeysAndLabels}
                    columnDisplayFunctions={clientTableColumnDisplayFunctions}
                    onRowClick={onClientTableRowClick}
                />
            </ClientsTableDiv>
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
