"use client";

import { formatDatetimeAsDate } from "@/app/parcels/getExpandedParcelDetails";
import React, { Suspense, useState } from "react";
import Table, { Row, TableHeaders } from "@/components/Tables/Table";

import { useTheme } from "styled-components";
import { ParcelsTableRow } from "@/app/parcels/getParcelsTableData";
import FlaggedForAttentionIcon from "@/components/Icons/FlaggedForAttentionIcon";
import PhoneIcon from "@/components/Icons/PhoneIcon";
import CongestionChargeAppliesIcon from "@/components/Icons/CongestionChargeAppliesIcon";
import DeliveryIcon from "@/components/Icons/DeliveryIcon";
import CollectionIcon from "@/components/Icons/CollectionIcon";
import ExpandedParcelDetails from "@/app/parcels/ExpandedParcelDetails";
import ExpandedParcelDetailsFallback from "@/app/parcels/ExpandedParcelDetailsFallback";
import Icon from "@/components/Icons/Icon";
import { faBoxArchive } from "@fortawesome/free-solid-svg-icons";
import Modal from "@/components/Modal/Modal";
import TableSurface from "@/components/Tables/TableSurface";
import ActionBar from "@/app/parcels/ActionBar";

export const clientTableHeaderKeysAndLabels: TableHeaders<ParcelsTableRow> = [
    ["iconsColumn", "Flags"],
    ["fullName", "Name"],
    ["familyCategory", "Family"],
    ["addressPostcode", "Postcode"],
    ["deliveryCollection", "Collection"],
    ["packingDatetime", "Packing Date"],
    ["packingTimeLabel", "Time"],
    ["lastStatus", "Last Status"],
];

const toggleableHeaders: (keyof ParcelsTableRow)[] = [
    "fullName",
    "familyCategory",
    "addressPostcode",
    "packingDatetime",
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
    packingDatetipowertome: {
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
    parcelsTableData: ParcelsTableRow[];
}

const ParcelsPage: React.FC<Props> = ({ parcelsTableData }) => {
    const [selectedParcelId, setSelectedParcelId] = useState<string | null>(null);
    const [selected, setSelected] = useState<number[]>([]);
    const theme = useTheme();

    const rowToIconsColumn = ({
        flaggedForAttention,
        requiresFollowUpPhoneCall,
    }: ParcelsTableRow["iconsColumn"]): React.ReactElement => {
        return (
            <>
                {flaggedForAttention && <FlaggedForAttentionIcon />}
                {requiresFollowUpPhoneCall && <PhoneIcon color={theme.main.largeForeground[0]} />}
            </>
        );
    };

    const rowToDeliveryCollectionColumn = (
        collectionData: ParcelsTableRow["deliveryCollection"]
    ): React.ReactElement => {
        const { collectionCentreName, collectionCentreAcronym, congestionChargeApplies } =
            collectionData;
        if (collectionCentreName === "Delivery") {
            return (
                <>
                    <DeliveryIcon color={theme.main.largeForeground[0]} />
                    {congestionChargeApplies && <CongestionChargeAppliesIcon />}
                </>
            );
        }

        return (
            <>
                <CollectionIcon
                    color={theme.main.largeForeground[0]}
                    collectionPoint={collectionCentreName}
                />
                {collectionCentreAcronym}
            </>
        );
    };

    const rowToLastStatusColumn = (data: ParcelsTableRow["lastStatus"] | null): string => {
        if (!data) {
            return "-";
        }
        const { name, timestamp } = data;
        return `${name} @ ${formatDatetimeAsDate(timestamp)}`;
    };

    const clientTableColumnDisplayFunctions = {
        iconsColumn: rowToIconsColumn,
        deliveryCollection: rowToDeliveryCollectionColumn,
        packingDatetime: formatDatetimeAsDate,
        lastStatus: rowToLastStatusColumn,
    };

    const onClientTableRowClick = (row: Row<ParcelsTableRow>): void => {
        setSelectedParcelId(row.data.parcelId);
    };

    const onExpandedClientDetailsClose = (): void => {
        setSelectedParcelId(null);
    };

    return (
        <>
            <ActionBar data={parcelsTableData} selected={selected} />
            <TableSurface>
                <Table
                    data={parcelsTableData}
                    headerKeysAndLabels={clientTableHeaderKeysAndLabels}
                    columnDisplayFunctions={clientTableColumnDisplayFunctions}
                    columnStyleOptions={clientTableColumnStyleOptions}
                    onRowClick={onClientTableRowClick}
                    checkboxes
                    onRowSelection={setSelected}
                    pagination
                    sortable={toggleableHeaders}
                    toggleableHeaders={toggleableHeaders}
                    filters={["addressPostcode"]}
                />
            </TableSurface>
            <Modal
                header={
                    <>
                        <Icon icon={faBoxArchive} color={theme.primary.largeForeground[2]} /> Parcel
                        Details
                    </>
                }
                isOpen={selectedParcelId !== null}
                onClose={onExpandedClientDetailsClose}
                headerId="expandedClientDetailsModal"
            >
                <Suspense fallback={<ExpandedParcelDetailsFallback />}>
                    <ExpandedParcelDetails parcelId={selectedParcelId} />
                </Suspense>
            </Modal>
        </>
    );
};

export default ParcelsPage;
