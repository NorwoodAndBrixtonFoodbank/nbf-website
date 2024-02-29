"use client";

import React, { Suspense, useEffect, useState } from "react";
import Table, { Row, TableHeaders } from "@/components/Tables/Table";
import styled, { useTheme } from "styled-components";
import {
    ParcelsTableRow,
    processingDataToParcelsTableData,
} from "@/app/parcels/getParcelsTableData";
import { formatDatetimeAsDate } from "@/app/parcels/getExpandedParcelDetails";
import { ControlContainer } from "@/components/Form/formStyling";
import DateRangeInputs, { DateRangeState } from "@/components/DateRangeInputs/DateRangeInputs";
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
import ActionBar from "@/app/parcels/ActionBar/ActionBar";
import { ButtonsDiv, Centerer, ContentDiv, OutsideDiv } from "@/components/Modal/ModalFormStyles";
import LinkButton from "@/components/Buttons/LinkButton";
import supabase from "@/supabaseClient";
import {
    getCongestionChargeDetailsForParcels,
    getParcelProcessingData,
} from "./fetchParcelTableData";
import dayjs from "dayjs";
import { checklistFilter } from "@/components/Tables/ChecklistFilter";
import { Filter } from "@/components/Tables/Filters";
import { useRouter, useSearchParams } from "next/navigation";

export const parcelTableHeaderKeysAndLabels: TableHeaders<ParcelsTableRow> = [
    ["iconsColumn", "Flags"],
    ["fullName", "Name"],
    ["familyCategory", "Family"],
    ["addressPostcode", "Postcode"],
    ["phoneNumber", "Phone"],
    ["voucherNumber", "Voucher"],
    ["deliveryCollection", "Collection"],
    ["packingDatetime", "Packing Date"],
    ["packingTimeLabel", "Time"],
    ["lastStatus", "Last Status"],
];

const defaultShownHeaders: (keyof ParcelsTableRow)[] = [
    "fullName",
    "familyCategory",
    "addressPostcode",
    "deliveryCollection",
    "packingDatetime",
    "packingTimeLabel",
    "lastStatus",
];

const toggleableHeaders: (keyof ParcelsTableRow)[] = [
    "fullName",
    "familyCategory",
    "addressPostcode",
    "phoneNumber",
    "voucherNumber",
    "deliveryCollection",
    "packingDatetime",
    "packingTimeLabel",
    "lastStatus",
];

const parcelTableColumnStyleOptions = {
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

const PreTableControls = styled.div`
    margin: 1rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: stretch;
    justify-content: space-between;
`;

const fetchAndFormatParcelTablesData = async (
    dateRange: DateRangeState
): Promise<ParcelsTableRow[]> => {
    const processingData = await getParcelProcessingData(supabase, dateRange);
    const congestionCharge = await getCongestionChargeDetailsForParcels(processingData, supabase);
    const formattedData = processingDataToParcelsTableData(processingData, congestionCharge);

    return formattedData;
};

const ParcelsPage: React.FC<{}> = () => {
    const startOfToday = dayjs().startOf("day");
    const endOfToday = dayjs().endOf("day");

    const [isLoading, setIsLoading] = useState(true);
    const [packingDateRange, setPackingDateRange] = useState<DateRangeState>({
        from: startOfToday,
        to: endOfToday,
    });
    const [tableData, setTableData] = useState<ParcelsTableRow[]>([]);
    const [selectedParcelId, setSelectedParcelId] = useState<string | null>(null);
    const [selected, setSelected] = useState<number[]>([]);
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const theme = useTheme();
    const router = useRouter();

    const searchParams = useSearchParams();
    const parcelId = searchParams.get("parcelId");

    useEffect(() => {
        if (parcelId) {
            setSelectedParcelId(parcelId);
            setModalIsOpen(true);
        }
    }, [parcelId]);

    useEffect(() => {
        let staleFetch = false;

        (async () => {
            setIsLoading(true);
            const formattedData = await fetchAndFormatParcelTablesData(packingDateRange);
            if (!staleFetch) {
                setTableData(formattedData);
            }
            setIsLoading(false);
        })();

        return () => {
            staleFetch = true;
        };
    }, [packingDateRange]);

    useEffect(() => {
        // This requires that the DB parcels table has Realtime turned on
        const subscriptionChannel = supabase
            .channel("parcels-table-changes")
            .on("postgres_changes", { event: "*", schema: "public", table: "parcels" }, async () =>
                setTableData(await fetchAndFormatParcelTablesData(packingDateRange))
            )
            .subscribe();

        return () => {
            supabase.removeChannel(subscriptionChannel);
        };
    }, [packingDateRange]);

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
        const { name, eventData, timestamp } = data;
        return (
            `${name}` +
            (eventData ? ` (${eventData})` : "") +
            ` @ ${formatDatetimeAsDate(timestamp)}`
        );
    };

    const parcelTableColumnDisplayFunctions = {
        iconsColumn: rowToIconsColumn,
        deliveryCollection: rowToDeliveryCollectionColumn,
        packingDatetime: formatDatetimeAsDate,
        lastStatus: rowToLastStatusColumn,
    };

    const onParcelTableRowClick = (row: Row<ParcelsTableRow>): void => {
        setSelectedParcelId(row.data.parcelId);
        router.push(`parcels/?parcelId=${row.data.parcelId}`);
    };

    const buildDeliveryCollectionFilter = (
        tableData: ParcelsTableRow[]
    ): Filter<ParcelsTableRow, any> => {
        const keySet = new Set();
        const options = tableData
            .map((row) => {
                if (!keySet.has(row.deliveryCollection.collectionCentreAcronym)) {
                    keySet.add(row.deliveryCollection.collectionCentreAcronym);
                    return row.deliveryCollection;
                } else {
                    return null;
                }
            })
            .filter((option) => option != null)
            .sort();

        return checklistFilter<ParcelsTableRow, any>({
            key: "deliveryCollection",
            filterLabel: "Collection",
            itemLabelsAndKeys: options.map((option) => [
                option!.collectionCentreName,
                option!.collectionCentreAcronym,
            ]),
            initialCheckedKeys: options.map((option) => option!.collectionCentreAcronym),
        });
    };

    const buildPackingTimeFilter = (tableData: ParcelsTableRow[]): Filter<ParcelsTableRow, any> => {
        const options = Array.from(
            new Set(tableData.map((row) => row.packingTimeLabel as string)).values()
        ).sort();
        return checklistFilter<ParcelsTableRow, any>({
            key: "packingTimeLabel",
            filterLabel: "Packing Time",
            itemLabelsAndKeys: options.map((value) => [value, value]),
            initialCheckedKeys: options,
        });
    };

    const lastStatusCellMatchOverride = (
        rowData: ParcelsTableRow,
        selectedKeys: string[]
    ): boolean => {
        const cellData = rowData["lastStatus"];

        return (
            (!cellData && selectedKeys.includes("None")) ||
            selectedKeys.some((key) => cellData?.name.includes(key))
        );
    };

    const buildLastStatusFilter = (tableData: ParcelsTableRow[]): Filter<ParcelsTableRow, any> => {
        const options = Array.from(
            new Set(
                tableData.map((row) => (row.lastStatus ? row.lastStatus.name : "None"))
            ).values()
        ).sort();

        return checklistFilter<ParcelsTableRow, any>({
            key: "lastStatus",
            filterLabel: "Last Status",
            itemLabelsAndKeys: options.map((value) => [value, value]),
            initialCheckedKeys: options,
            cellMatchOverride: lastStatusCellMatchOverride,
        });
    };

    return (
        <>
            <PreTableControls>
                <ControlContainer>
                    <DateRangeInputs
                        range={packingDateRange}
                        setRange={setPackingDateRange}
                    ></DateRangeInputs>
                </ControlContainer>
                <ActionBar data={tableData} selected={selected} />
            </PreTableControls>
            {isLoading ? (
                <></>
            ) : (
                <>
                    <TableSurface>
                        <Table
                            data={tableData}
                            headerKeysAndLabels={parcelTableHeaderKeysAndLabels}
                            columnDisplayFunctions={parcelTableColumnDisplayFunctions}
                            columnStyleOptions={parcelTableColumnStyleOptions}
                            onRowClick={onParcelTableRowClick}
                            checkboxes
                            onRowSelection={setSelected}
                            pagination
                            sortable={toggleableHeaders}
                            defaultShownHeaders={defaultShownHeaders}
                            toggleableHeaders={toggleableHeaders}
                            filters={[
                                "fullName",
                                "addressPostcode",
                                buildDeliveryCollectionFilter(tableData),
                                buildPackingTimeFilter(tableData),
                            ]}
                            additionalFilters={[
                                "familyCategory",
                                "phoneNumber",
                                "voucherNumber",
                                buildLastStatusFilter(tableData),
                            ]}
                        />
                    </TableSurface>
                    <Modal
                        header={
                            <>
                                <Icon
                                    icon={faBoxArchive}
                                    color={theme.primary.largeForeground[2]}
                                />{" "}
                                Parcel Details
                            </>
                        }
                        isOpen={modalIsOpen}
                        onClose={() => {
                            setModalIsOpen(false);
                            router.push("parcels/");
                        }}
                        headerId="expandedParcelDetailsModal"
                    >
                        <OutsideDiv>
                            <ContentDiv>
                                <Suspense fallback={<ExpandedParcelDetailsFallback />}>
                                    <ExpandedParcelDetails parcelId={selectedParcelId} />
                                </Suspense>
                            </ContentDiv>

                            <ButtonsDiv>
                                <Centerer>
                                    <LinkButton link={`/parcels/edit/${selectedParcelId}`}>
                                        Edit Parcel
                                    </LinkButton>
                                </Centerer>
                            </ButtonsDiv>
                        </OutsideDiv>
                    </Modal>
                </>
            )}
        </>
    );
};

export default ParcelsPage;
