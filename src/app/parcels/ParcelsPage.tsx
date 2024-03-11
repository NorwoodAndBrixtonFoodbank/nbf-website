"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import Table, { Row, SortOptions, TableHeaders } from "@/components/Tables/Table";
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
import { saveParcelStatus, statusNamesInWorkflowOrder } from "./ActionBar/Statuses";
import { CircularProgress } from "@mui/material";
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

const sortStatusByWorkflowOrder = (
    statusA: ParcelsTableRow["lastStatus"],
    statusB: ParcelsTableRow["lastStatus"]
): number => {
    const indexA = statusNamesInWorkflowOrder.indexOf(statusA?.name ?? "");
    const indexB = statusNamesInWorkflowOrder.indexOf(statusB?.name ?? "");
    if (indexA === indexB) {
        return 0;
    }
    return indexA < indexB ? 1 : -1;
};

const sortableColumns: (keyof ParcelsTableRow | SortOptions<ParcelsTableRow, "lastStatus">)[] = [
    "fullName",
    "familyCategory",
    "addressPostcode",
    "phoneNumber",
    "voucherNumber",
    "deliveryCollection",
    "packingDatetime",
    "packingTimeLabel",
    { key: "lastStatus", sortFunction: sortStatusByWorkflowOrder },
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

const parcelIdParam = "parcelId";

const areDateRangesIdentical = (
    dateRangeA: DateRangeState,
    dateRangeB: DateRangeState
): boolean => {
    return (
        areDaysIdentical(dateRangeA.from, dateRangeB.from) &&
        areDaysIdentical(dateRangeA.to, dateRangeB.to)
    );
};

const areDaysIdentical = (dayA: dayjs.Dayjs | null, dayB: dayjs.Dayjs | null): boolean => {
    return dayA && dayB ? dayA.isSame(dayB) : dayA === dayB;
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

    const [selectedRowIndices, setSelectedRowIndices] = useState<number[]>([]);
    const [isAllCheckBoxSelected, setAllCheckBoxSelected] = useState(false);
    const fetchParcelsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const theme = useTheme();
    const router = useRouter();

    const searchParams = useSearchParams();
    const parcelId = searchParams.get(parcelIdParam);

    useEffect(() => {
        if (parcelId) {
            setSelectedParcelId(parcelId);
            setModalIsOpen(true);
        }
    }, [parcelId]);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            const dateRangeToFetch = { ...packingDateRange };
            const tableData = await fetchAndFormatParcelTablesData(dateRangeToFetch);

            if (areDateRangesIdentical(dateRangeToFetch, packingDateRange)) {
                setTableData(tableData);
            }

            setIsLoading(false);
        })();
    }, [packingDateRange]);

    useEffect(() => {
        // This requires that both the DB parcels and events tables have Realtime turned on
        const loadParcelTableData = async (): Promise<void> => {
            if (fetchParcelsTimer.current) {
                clearTimeout(fetchParcelsTimer.current);
                fetchParcelsTimer.current = null;
            }

            setIsLoading(true);
            fetchParcelsTimer.current = setTimeout(async () => {
                setTableData(await fetchAndFormatParcelTablesData(packingDateRange));
                setIsLoading(false);
            }, 500);
        };

        const subscriptionChannel = supabase
            .channel("parcels-table-changes")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "parcels" },
                loadParcelTableData
            )
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "events" },
                loadParcelTableData
            )
            .subscribe();

        return () => {
            supabase.removeChannel(subscriptionChannel);
        };
    }, [packingDateRange]);

    useEffect(() => {
        setSelectedRowIndices([]);
    }, [tableData]);

    const selectOrDeselectRow = (rowIndex: number): void => {
        setSelectedRowIndices((currentIndices) => {
            if (currentIndices.includes(rowIndex)) {
                return currentIndices.filter((index) => index !== rowIndex);
            }
            return currentIndices.concat([rowIndex]);
        });
    };

    const toggleAllCheckBox = (): void => {
        if (isAllCheckBoxSelected) {
            setSelectedRowIndices([]);
            setAllCheckBoxSelected(false);
        } else {
            setSelectedRowIndices(tableData.map((data, index) => index));
            setAllCheckBoxSelected(true);
        }
    };

    useEffect(() => {
        const allChecked = selectedRowIndices.length === tableData.length;
        if (allChecked !== isAllCheckBoxSelected) {
            setAllCheckBoxSelected(allChecked);
        }
    }, [tableData.length, selectedRowIndices, isAllCheckBoxSelected]);

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
        router.push(`/parcels?${parcelIdParam}=${row.data.parcelId}`);
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
            initialCheckedKeys: options.filter((value) => value !== "Request Deleted"),
            cellMatchOverride: lastStatusCellMatchOverride,
        });
    };

    const deleteParcels = async (parcels: ParcelsTableRow[]): Promise<void> => {
        setIsLoading(true);
        await saveParcelStatus(
            parcels.map((parcel) => parcel.parcelId),
            "Request Deleted"
        );
        setSelectedRowIndices([]);
        setIsLoading(false);
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
                <ActionBar
                    selectedParcels={selectedRowIndices.map((index) => tableData[index])}
                    onDeleteParcels={deleteParcels}
                    willSaveParcelStatus={() => setIsLoading(true)}
                    hasSavedParcelStatus={() => setIsLoading(false)}
                />
            </PreTableControls>
            {isLoading ? (
                <Centerer>
                    <CircularProgress aria-label="table-progress-bar" />
                </Centerer>
            ) : (
                <>
                    <TableSurface>
                        <Table
                            data={tableData}
                            headerKeysAndLabels={parcelTableHeaderKeysAndLabels}
                            columnDisplayFunctions={parcelTableColumnDisplayFunctions}
                            columnStyleOptions={parcelTableColumnStyleOptions}
                            onRowClick={onParcelTableRowClick}
                            pagination
                            sortable={sortableColumns}
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
                            checkboxConfig={{
                                displayed: true,
                                selectedRowIndices: selectedRowIndices,
                                isAllCheckboxChecked: isAllCheckBoxSelected,
                                onCheckboxClicked: (rowIndex: number) =>
                                    selectOrDeselectRow(rowIndex),
                                onAllCheckboxClicked: () => toggleAllCheckBox(),
                            }}
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
                            router.push("/parcels");
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
