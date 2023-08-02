"use client";

import React, { Suspense, useState } from "react";
import Table, { Datum } from "@/components/Tables/Table";

import styled from "styled-components";
import { ClientTableRow } from "@/app/clients/getClientsTableData";
import FlaggedForAttentionIcon from "@/components/Icons/FlaggedForAttentionIcon";
import PhoneIcon from "@/components/Icons/PhoneIcon";
import CongestionChargeAppliesIcon from "@/components/Icons/CongestionChargeAppliesIcon";
import DeliveryIcon from "@/components/Icons/DeliveryIcon";
import CollectionIcon from "@/components/Icons/CollectionIcon";
import ExpandedClientDetailsModal from "@/app/clients/ExpandedClientDetailsModal";
import ExpandedClientDetailsFallback from "@/app/clients/ExpandedClientDetailsFallback";

const ClientsTableDiv = styled.div``;

const rowToIconsColumn = (row: ClientTableRow): React.ReactElement => {
    return (
        <>
            {row.flaggedForAttention ? <FlaggedForAttentionIcon /> : <></>}
            {/*// TODO Change PhoneIcon support for Dark Mode*/}
            {row.requiresFollowUpPhoneCall ? <PhoneIcon /> : <></>}
        </>
    );
};

const rowToDeliveryCollectionColumn = (row: ClientTableRow): React.ReactElement => {
    if (row.collectionCentre === "Delivery") {
        return (
            <>
                <DeliveryIcon />
                {row.congestionChargeApplies ? <CongestionChargeAppliesIcon /> : <> </>}
            </>
        );
    }

    return (
        <>
            <CollectionIcon collectionPoint={row.collectionCentre} />
            {collectionCentreToAbbreviation(row.collectionCentre)}
        </>
    );
};

const collectionCentreToAbbreviation = (collectionCentre: string): string => {
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

export const clientTableHeaders = {
    iconsColumn: "",
    fullName: "Name",
    familyCategory: "Family",
    addressPostcode: "Postcode",
    deliveryCollection: "",
    packingDate: "Packing Date",
    packingTimeLabel: "Time",
    lastStatus: "Last Status",
};

export const clientTableColumnDisplayFunctions = {
    iconsColumn: rowToIconsColumn,
    deliveryCollection: rowToDeliveryCollectionColumn,
};

interface Props {
    clientsTableData: Datum[];
}

const ClientsPage: React.FC<Props> = (props) => {
    const [selectedParcelId, setSelectedParcelId] = useState<string | null>(null);

    const onClientTableRowClick = (row: ClientTableRow): void => {
        setSelectedParcelId(row.parcelId);
    };

    const onExpandedClientDetailsClose = (): void => {
        setSelectedParcelId(null);
    };

    return (
        <>
            <ClientsTableDiv>
                <Table
                    data={props.clientsTableData}
                    headers={clientTableHeaders}
                    columnDisplayFunctions={clientTableColumnDisplayFunctions}
                    onRowClick={onClientTableRowClick}
                />
            </ClientsTableDiv>
            <Suspense
                fallback={
                    <ExpandedClientDetailsFallback
                        parcelId={selectedParcelId}
                        onClose={onExpandedClientDetailsClose}
                    />
                }
            >
                <ExpandedClientDetailsModal
                    parcelId={selectedParcelId}
                    onClose={onExpandedClientDetailsClose}
                />
            </Suspense>
        </>
    );
};

export default ClientsPage;
