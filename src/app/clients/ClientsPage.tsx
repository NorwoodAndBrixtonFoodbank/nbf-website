"use client";

import React, { Suspense, useState } from "react";
import Table, { Row, TableHeaders } from "@/components/Tables/Table";

import { useTheme } from "styled-components";
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
import { Schema } from "@/database_utils";
import TableSurface from "@/components/Tables/TableSurface";
import { CenterComponent } from "@/components/Form/formStyling";
import Button from "@mui/material/Button";
import ActionBar from "@/app/clients/ActionBar";

// TODO Change Button to LinkButton

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

const clientTableColumnStyleOptions = {
    iconsColumn: {
        width: "3rem",
    },
    fullName: {
        minWidth: "8rem",
    },
    familyCategory: {
        hide: 550,
    },
    addressPostcode: {
        hide: 800,
    },
    deliveryCollection: {
        minWidth: "6rem",
    },
    packingDate: {
        hide: 800,
    },
    packingTimeLabel: {
        hide: 800,
        minWidth: "6rem",
    },
    lastStatus: {
        minWidth: "8rem",
    },
};

interface Props {
    clientsTableData: ClientsTableRow[];
}

const ClientsPage: React.FC<Props> = (props) => {
    const [selectedParcelId, setSelectedParcelId] = useState<string | null>(null);
    const [selected, setSelected] = useState<number[]>([]);
    const theme = useTheme();

    const rowToIconsColumn = (row: Row): React.ReactElement => {
        const data = row.data as ClientsTableRow;

        return (
            <>
                {data.flaggedForAttention ? <FlaggedForAttentionIcon /> : <></>}
                {data.requiresFollowUpPhoneCall ? (
                    <PhoneIcon color={theme.main.largeForeground[0]} />
                ) : (
                    <></>
                )}
            </>
        );
    };

    const rowToDeliveryCollectionColumn = (row: Row): React.ReactElement => {
        const data = row.data as ClientsTableRow;

        if (data.collectionCentre === "Delivery") {
            return (
                <>
                    <DeliveryIcon color={theme.main.largeForeground[0]} />
                    {data.congestionChargeApplies ? <CongestionChargeAppliesIcon /> : <></>}
                </>
            );
        }

        return (
            <>
                <CollectionIcon
                    color={theme.main.largeForeground[0]}
                    collectionPoint={data.collectionCentre}
                />
                {collectionCentreToAbbreviation(data.collectionCentre)}
            </>
        );
    };

    const clientTableColumnDisplayFunctions = {
        iconsColumn: rowToIconsColumn,
        deliveryCollection: rowToDeliveryCollectionColumn,
    };

    const onClientTableRowClick = (row: Row): void => {
        const data = row.data as ClientsTableRow;
        setSelectedParcelId(data.parcelId);
    };

    const onExpandedClientDetailsClose = (): void => {
        setSelectedParcelId(null);
    };

    return (
        <>
            <ActionBar data={props.clientsTableData} selected={selected} />
            <TableSurface>
                <Table
                    data={props.clientsTableData}
                    headerKeysAndLabels={clientTableHeaderKeysAndLabels}
                    columnDisplayFunctions={clientTableColumnDisplayFunctions}
                    columnStyleOptions={clientTableColumnStyleOptions}
                    onRowClick={onClientTableRowClick}
                    checkboxes={true}
                    onRowSelection={setSelected}
                    pagination={true}
                    sortable={true}
                    headerFilters={["addressPostcode"]}
                    toggleableHeaders={toggleableHeaders}
                />
            </TableSurface>
            <Modal
                header={
                    <>
                        <Icon icon={faUser} color={theme.primary.largeForeground[2]} /> Client
                        Details
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
            <CenterComponent>
                <Button variant="contained" href="/clients/add">
                    Add Clients
                </Button>
            </CenterComponent>
        </>
    );
};

export default ClientsPage;
