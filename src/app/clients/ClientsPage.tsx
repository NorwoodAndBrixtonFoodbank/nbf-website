"use client";

import React, { Suspense, useState } from "react";
import Table, { Row, SortOptions, TableHeaders } from "@/components/Tables/Table";

import { useTheme } from "styled-components";
import { ParcelsTableRow } from "@/app/clients/getClientsTableData";
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
import ActionBar, { statuses } from "@/app/clients/ActionBar";
import AddParcelsButton from "@/app/clients/AddParcelsButton";
import { dateFilter } from "@/components/Tables/Filters";

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

const parcelTableKeysAndLabels: TableHeaders<ParcelsTableRow> = [
    ["fullName", "Name"],
    ["familyCategory", "Family"],
    ["addressPostcode", "Postcode"],
    ["deliveryCollection", ""],
    ["packingDatetime", "Packing Date"],
    ["packingTimeLabel", "Time"],
    ["lastStatus", "Last Status"],
    ["voucherNumber", "Voucher"],
];

const toggleableHeaders: readonly (keyof ParcelsTableRow)[] = [
    "fullName",
    "familyCategory",
    "addressPostcode",
    "packingDatetime",
    "packingTimeLabel",
    "lastStatus",
    "voucherNumber",
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
    collectionCentre: {
        minWidth: "6rem",
    },
    packingDatetime: {
        hide: 800,
    },
    packingTimeLabel: {
        hide: 800,
        minWidth: "6rem",
    },
    lastStatus: {
        minWidth: "8rem",
    },
    voucherNumber: {
        hide: 800,
    },
};

interface Props {
    clientsTableData: ParcelsTableRow[];
}

const ClientsPage: React.FC<Props> = ({ clientsTableData: parcelsTableData }) => {
    const [selectedParcelId, setSelectedParcelId] = useState<string | null>(null);
    const [selected, setSelected] = useState<number[]>([]);
    const theme = useTheme();

    const clientTableColumnDisplayFunctions = {
        iconsColumn: ({
            flaggedForAttention,
            requiresFollowUpPhoneCall,
        }: ParcelsTableRow["iconsColumn"]): React.ReactElement => {
            return (
                <>
                    {flaggedForAttention && <FlaggedForAttentionIcon />}
                    {requiresFollowUpPhoneCall && (
                        <PhoneIcon color={theme.main.largeForeground[0]} />
                    )}
                </>
            );
        },
        deliveryCollection: (data: ParcelsTableRow["deliveryCollection"]): React.ReactElement => {
            if (data.collectionCentre === "Delivery") {
                return (
                    <>
                        <DeliveryIcon color={theme.main.largeForeground[0]} />
                        {data.congestionChargeApplies && <CongestionChargeAppliesIcon />}
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
        },
        packingDatetime: (datetime: ParcelsTableRow["packingDatetime"]): string => {
            return datetime ? datetime.toLocaleDateString() : "";
        },
        lastStatus: (status: ParcelsTableRow["lastStatus"]): React.ReactNode => {
            if (status === null) {
                return <></>;
            }

            const { name, timestamp } = status;

            return `${name} @ ${timestamp.toLocaleDateString()}`;
        },
    };

    const onClientTableRowClick = (row: Row<ParcelsTableRow>): void => {
        setSelectedParcelId(row.data.parcelId);
    };

    const onExpandedClientDetailsClose = (): void => {
        setSelectedParcelId(null);
    };

    const lastStatusSortOptions: SortOptions<ParcelsTableRow, "lastStatus"> = {
        key: "lastStatus",
        sortFunction: (lastStatus1, lastStatus2) => {
            const idx1 = statuses.findIndex((status) => status === lastStatus1?.name);
            const idx2 = statuses.findIndex((status) => status === lastStatus2?.name);
            if (idx1 === -1) {
                return 1;
            }

            if (idx2 === -1) {
                return -1;
            }

            return idx1 - idx2;
        },
    };

    return (
        <>
            <ActionBar data={parcelsTableData} selected={selected} />
            <TableSurface>
                <Table
                    data={parcelsTableData}
                    headerKeysAndLabels={parcelTableKeysAndLabels}
                    columnDisplayFunctions={clientTableColumnDisplayFunctions}
                    columnStyleOptions={clientTableColumnStyleOptions}
                    onRowClick={onClientTableRowClick}
                    checkboxes={true}
                    onRowSelection={setSelected}
                    pagination={true}
                    sortable={[
                        "fullName",
                        "familyCategory",
                        "packingDatetime",
                        lastStatusSortOptions,
                    ]}
                    filters={[
                        dateFilter<ParcelsTableRow, "packingDatetime">({
                            key: "packingDatetime",
                            label: "Packing Date",
                        }),
                        "addressPostcode",
                        "lastStatus",
                    ]}
                    additionalFilters={["fullName", "voucherNumber"]}
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
                <AddParcelsButton data={parcelsTableData} />
            </CenterComponent>
        </>
    );
};

export default ClientsPage;
