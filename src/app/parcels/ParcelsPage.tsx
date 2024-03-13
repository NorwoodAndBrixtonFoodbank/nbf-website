"use client";

import Table, { Row, SortOptions, TableHeaders, SortState } from "@/components/Tables/Table";
import React, { Suspense, useEffect, useRef, useState } from "react";
import styled, { useTheme } from "styled-components";
import { ParcelsTableRow } from "@/app/parcels/getParcelsTableData";
import { formatDatetimeAsDate } from "@/app/parcels/getExpandedParcelDetails";
import { ControlContainer } from "@/components/Form/formStyling";
import { DateRangeState } from "@/components/DateRangeInputs/DateRangeInputs";
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
    CollectionCentresOptions,
    ParcelProcessingData,
    getAllValuesForKeys,
    getParcelIds,
    getParcelsCount,
    getParcelsData,
} from "./fetchParcelTableData";
import dayjs from "dayjs";
import { checklistFilter } from "@/components/Tables/ChecklistFilter";
import { Filter, FilterMethodType } from "@/components/Tables/Filters";
import { saveParcelStatus, statusNamesInWorkflowOrder } from "./ActionBar/Statuses";
import { useRouter, useSearchParams } from "next/navigation";
import { PostgrestFilterBuilder, PostgrestQueryBuilder } from "@supabase/postgrest-js";
import { Database } from "@/databaseTypesFile";
import { buildTextFilter } from "@/components/Tables/TextFilter";
import { dateFilter } from "@/components/Tables/DateFilter";

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

const sortableColumns: SortOptions<ParcelsTableRow, any>[] = [
    {
        key: "fullName",
        sortMethod: (query, sortDirection) =>
            query.order("client(full_name)", { ascending: sortDirection === "asc" }),
    },
    {
        key: "familyCategory",
        sortMethod: (query, sortDirection) =>
            query.order("family_count(family_count)", { ascending: sortDirection === "asc" }),
    },
    {
        key: "addressPostcode",
        sortMethod: (query, sortDirection) =>
            query.order("client(address_postcode)", { ascending: sortDirection === "asc" }),
    },
    {
        key: "phoneNumber",
        sortMethod: (query, sortDirection) =>
            query.order("client(phone_number)", { ascending: sortDirection === "asc" }),
    },
    {
        key: "voucherNumber",
        sortMethod: (query, sortDirection) =>
            query.order("voucher_number", { ascending: sortDirection === "asc" }),
    },
    {
        key: "deliveryCollection",
        sortMethod: (query, sortDirection) =>
            query.order("collection_centre(name)", { ascending: sortDirection === "asc" }),
    },
    {
        key: "packingDatetime",
        sortMethod: (query, sortDirection) =>
            query.order("packing_datetime", { ascending: sortDirection === "asc" }),
    },
    //{key: "packingTimeLabel",sortMethod: (query, sortDirection) => query.order("client(full_name)", {ascending: sortDirection === "asc"})}, broke
    //{ key: "lastStatus", sortMethod: sortStatusByWorkflowOrder }, to dofix
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

const fullNameSearch = (
    query: PostgrestFilterBuilder<Database["public"], any, any>,
    state: string
): PostgrestFilterBuilder<Database["public"], any, any> => {
    return query.ilike("client.full_name", `%${state}%`);
};

const postcodeSearch = (
    query: PostgrestFilterBuilder<Database["public"], any, any>,
    state: string
): PostgrestFilterBuilder<Database["public"], any, any> => {
    return query.ilike("client.address_postcode", `%${state}%`);
};

const familySearch = (
    query: PostgrestFilterBuilder<Database["public"], any, any>,
    state: string
): PostgrestFilterBuilder<Database["public"], any, any> => {
    if (state === "") {
        return query;
    }
    if ("Single".includes(state) || "single".includes(state)) {
        return query.lte("family_count.family_count", 1);
    }
    if ("Family of".includes(state) || "family of".includes(state)) {
        return query.gte("family_count.family_count", 2);
    }
    const stateAsNumber = Number(state);
    if (Number.isNaN(stateAsNumber)) {
        return query.eq("family_count.family_count", -1);
    }
    if (stateAsNumber >= 10) {
        return query.gte("family_count.family_count", 10);
    }
    if (stateAsNumber <= 1) {
        return query.lte("family_count.family_count", 1);
    }
    return query.eq("family_count.family_count", Number(state));
};

const phoneSearch = (
    query: PostgrestFilterBuilder<Database["public"], any, any>,
    state: string
): PostgrestFilterBuilder<Database["public"], any, any> => {
    return query.ilike("client.phone_number", `%${state}%`);
};

const voucherSearch = (
    query: PostgrestFilterBuilder<Database["public"], any, any>,
    state: string
): PostgrestFilterBuilder<Database["public"], any, any> => {
    return query.ilike("voucher_number", `%${state}%`);
};

const buildDateFilter = (initialState: DateRangeState): Filter<ParcelsTableRow, DateRangeState> => {
    const dateSearch = (
        query: PostgrestFilterBuilder<Database["public"], any, any>,
        state: DateRangeState
    ): PostgrestFilterBuilder<Database["public"], any, any> => {
        return query.gte("packing_datetime", state.from).lte("packing_datetime", state.to);
    };
    return dateFilter<ParcelsTableRow>({
        key: "packingDatetime",
        label: "",
        methodConfig: { methodType: FilterMethodType.Server, method: dateSearch },
        initialState: initialState,
    });
};

const buildDeliveryCollectionFilter = async (
    optionsFilters: Filter<ParcelsTableRow, any>[]
): Promise<Filter<ParcelsTableRow, string[]>> => {
    const deliveryCollectionSearch = (
        query: PostgrestFilterBuilder<Database["public"], any, any>,
        state: string[]
    ): PostgrestFilterBuilder<Database["public"], any, any> => {
        return query.in("collection_centre.acronym", state);
    };
    const getAllDeliveryCollectionOptions = (
        query: PostgrestQueryBuilder<Database["public"], any, any>
    ): PostgrestFilterBuilder<Database["public"], any, any> => {
        return query.select(
            " parcel_id:primary_key, packing_datetime, collection_centre:collection_centres(*)"
        );
    };
    const keySet = new Set();
    const response: Partial<ParcelProcessingData> = await getAllValuesForKeys<
        Partial<ParcelProcessingData>
    >(supabase, getAllDeliveryCollectionOptions, optionsFilters);
    const optionsSet: (CollectionCentresOptions | null)[] = response
        .map((row) => {
            if (row?.collection_centre && !keySet.has(row.collection_centre.acronym)) {
                keySet.add(row.collection_centre.acronym);
                return row.collection_centre;
            } else {
                return null;
            }
        })
        .filter((option) => option != null)
        .sort();
    return checklistFilter<ParcelsTableRow>({
        key: "deliveryCollection",
        filterLabel: "Collection",
        itemLabelsAndKeys: optionsSet.map((option) => [option!.name, option!.acronym]),
        initialCheckedKeys: optionsSet.map((option) => option!.acronym),
        methodConfig: { methodType: FilterMethodType.Server, method: deliveryCollectionSearch },
    });
};

const buildPackingTimeFilter = (): Filter<ParcelsTableRow, string[]> => {
    const packingTimeSearch = (
        query: PostgrestFilterBuilder<Database["public"], any, any>,
        state: string[]
    ): PostgrestFilterBuilder<Database["public"], any, any> => {
        return query; //.in('packing_datetime', `%${state}%`);
    };
    // const options = Array.from(
    //     new Set(tableData.map((row) => row.packingTimeLabel as string)).values()
    // ).sort(); //todo same as above
    const options = ["AM", "PM"]; //fudge for now
    return checklistFilter<ParcelsTableRow>({
        key: "packingTimeLabel",
        filterLabel: "Packing Time",
        itemLabelsAndKeys: options.map((value) => [value, value]),
        initialCheckedKeys: options,
        methodConfig: { methodType: FilterMethodType.Server, method: packingTimeSearch },
    });
};

const lastStatusCellMatchOverride = (rowData: ParcelsTableRow, selectedKeys: string[]): boolean => {
    const cellData = rowData["lastStatus"];

    return (
        (!cellData && selectedKeys.includes("None")) ||
        selectedKeys.some((key) => cellData?.name.includes(key))
    );
};

const buildLastStatusFilter = (): Filter<ParcelsTableRow, string[]> => {
    const lastStatusSearch = (
        query: PostgrestFilterBuilder<Database["public"], any, any>,
        state: string[]
    ): PostgrestFilterBuilder<Database["public"], any, any> => {
        return query.in("events.event_name", state); //not sure if this will work?
    };

    // const options = Array.from( //as above
    //     new Set(
    //         tableData.map((row) => (row.lastStatus ? row.lastStatus.name : "None"))
    //     ).values()
    // ).sort();

    const options: string[] = statusNamesInWorkflowOrder; //cheat for now. TODO

    return checklistFilter<ParcelsTableRow>({
        key: "lastStatus",
        filterLabel: "Last Status",
        itemLabelsAndKeys: options.map((value) => [value, value]),
        initialCheckedKeys: options.filter((option) => option !== "Request Deleted"),
        //cellMatchOverride: lastStatusCellMatchOverride, todo: wtf is this :0
        methodConfig: { methodType: FilterMethodType.Server, method: lastStatusSearch },
    });
};

const ParcelsPage: React.FC<{}> = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [parcelsDataPortion, setParcelsDataPortion] = useState<ParcelsTableRow[]>([]);
    const [totalRows, setTotalRows] = useState<number>(0);
    const [selectedParcelId, setSelectedParcelId] = useState<string | null>(null);

    const [checkedParcelIds, setCheckedParcelIds] = useState<string[]>([]);
    const [isAllCheckBoxSelected, setAllCheckBoxSelected] = useState(false);
    const fetchParcelsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const theme = useTheme();
    const router = useRouter();

    const searchParams = useSearchParams();
    const parcelId = searchParams.get(parcelIdParam);

    const [sortState, setSortState] = useState<SortState<ParcelsTableRow>>({ sort: false });

    useEffect(() => {
        if (parcelId) {
            setSelectedParcelId(parcelId);
            setModalIsOpen(true);
        }
    }, [parcelId]);

    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const startPoint = (currentPage - 1) * perPage;
    const endPoint = currentPage * perPage - 1;

    const [primaryFilters, setPrimaryFilters] = useState<Filter<ParcelsTableRow, any>[]>([]);
    const [additionalFilters, setAdditionalFilters] = useState<Filter<ParcelsTableRow, any>[]>([]);

    const [areFiltersLoading, setAreFiltersLoading] = useState<boolean>(true);

    useEffect(() => {
        const buildFilters = async (): Promise<{
            primaryFilters: Filter<ParcelsTableRow, any>[];
            additionalFilters: Filter<ParcelsTableRow, any>[];
        }> => {
            const startOfToday = dayjs().startOf("day");
            const endOfToday = dayjs().endOf("day");
            const dateFilter = buildDateFilter({
                from: startOfToday,
                to: endOfToday,
            });
            const primaryFilters: Filter<ParcelsTableRow, any>[] = [
                dateFilter,
                buildTextFilter({
                    key: "fullName",
                    label: "Name",
                    headers: parcelTableHeaderKeysAndLabels,
                    methodConfig: { methodType: FilterMethodType.Server, method: fullNameSearch },
                }),
                buildTextFilter({
                    key: "addressPostcode",
                    label: "Postcode",
                    headers: parcelTableHeaderKeysAndLabels,
                    methodConfig: { methodType: FilterMethodType.Server, method: postcodeSearch },
                }),
                await buildDeliveryCollectionFilter([dateFilter]),
                //buildPackingTimeFilter(), //broken
            ];

            const additionalFilters = [
                buildTextFilter({
                    key: "familyCategory",
                    label: "Family",
                    headers: parcelTableHeaderKeysAndLabels,
                    methodConfig: { methodType: FilterMethodType.Server, method: familySearch },
                }), //broken
                buildTextFilter({
                    key: "phoneNumber",
                    label: "Phone",
                    headers: parcelTableHeaderKeysAndLabels,
                    methodConfig: { methodType: FilterMethodType.Server, method: phoneSearch },
                }),
                buildTextFilter({
                    key: "voucherNumber",
                    label: "Voucher",
                    headers: parcelTableHeaderKeysAndLabels,
                    methodConfig: { methodType: FilterMethodType.Server, method: voucherSearch },
                }),
                buildLastStatusFilter(), //hardcoded options and broken, filters out unwanted events but keeps the parcel :0
            ];
            return { primaryFilters: primaryFilters, additionalFilters: additionalFilters };
        };
        (async () => {
            setAreFiltersLoading(true);
            const filtersObject = await buildFilters();
            setPrimaryFilters(filtersObject.primaryFilters);
            setAdditionalFilters(filtersObject.additionalFilters);
            setAreFiltersLoading(false);
        })();
    }, []);

    useEffect(() => {
        if (!areFiltersLoading) {
            const allFilters = [...primaryFilters, ...additionalFilters];
            const freshRequest = (): boolean => {
                return true; //to do: ask for help on this - we need this for certain
            };
            (async () => {
                setIsLoading(true);
                const totalRows = await getParcelsCount(supabase, allFilters);
                const fetchedData = await getParcelsData(
                    supabase,
                    allFilters,
                    sortState,
                    startPoint,
                    endPoint
                );
                if (freshRequest()) {
                    setTotalRows(totalRows);
                    setParcelsDataPortion(fetchedData);
                }
                setIsLoading(false);
            })();
        }
    }, [startPoint, endPoint, primaryFilters, additionalFilters, sortState, areFiltersLoading]);

    useEffect(() => {
        // This requires that the DB parcels table has Realtime turned on
        if (!areFiltersLoading) {
            const allFilters = [...primaryFilters, ...additionalFilters];
            const loadCountAndDataWithTimer = async (): Promise<void> => {
                if (fetchParcelsTimer.current) {
                    clearTimeout(fetchParcelsTimer.current);
                    fetchParcelsTimer.current = null;
                }

                setIsLoading(true);
                fetchParcelsTimer.current = setTimeout(async () => {
                    setTotalRows(await getParcelsCount(supabase, allFilters));
                    const fetchedData = await getParcelsData(
                        supabase,
                        allFilters,
                        sortState,
                        startPoint,
                        endPoint
                    );
                    setParcelsDataPortion(fetchedData);
                    setIsLoading(false);
                }, 500);
            };

            const subscriptionChannel = supabase
                .channel("parcels-table-changes")
                .on(
                    "postgres_changes",
                    { event: "*", schema: "public", table: "parcels" },
                    loadCountAndDataWithTimer
                )
                .on(
                    "postgres_changes",
                    { event: "*", schema: "public", table: "events" },
                    loadCountAndDataWithTimer
                )
                .subscribe();

            return () => {
                supabase.removeChannel(subscriptionChannel);
            };
        }
    }, [endPoint, startPoint, primaryFilters, additionalFilters, sortState, areFiltersLoading]);

    useEffect(() => {
        setCheckedParcelIds([]);
    }, [primaryFilters, additionalFilters]);

    const selectOrDeselectRow = (parcelId: string): void => {
        setCheckedParcelIds((currentIndices) => {
            if (currentIndices.includes(parcelId)) {
                return currentIndices.filter((dummyParcelId) => dummyParcelId !== parcelId);
            }
            return currentIndices.concat([parcelId]);
        });
    };

    const toggleAllCheckBox = async (): Promise<void> => {
        if (isAllCheckBoxSelected) {
            setCheckedParcelIds([]);
            setAllCheckBoxSelected(false);
        } else {
            setCheckedParcelIds(
                await getParcelIds(supabase, primaryFilters.concat(additionalFilters), sortState)
            );
            setAllCheckBoxSelected(true);
        }
    };

    useEffect(() => {
        const allChecked = checkedParcelIds.length === totalRows;
        if (allChecked !== isAllCheckBoxSelected) {
            setAllCheckBoxSelected(allChecked);
        }
    }, [totalRows, checkedParcelIds, isAllCheckBoxSelected]);

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

    const deleteParcels = async (parcels: ParcelsTableRow[]): Promise<void> => {
        setIsLoading(true);
        await saveParcelStatus(
            parcels.map((parcel) => parcel.parcelId),
            "Request Deleted"
        );
        setCheckedParcelIds([]);
        setIsLoading(false);
    };

    const getCheckedParcelsData = async (
        checkedParcelIds: string[]
    ): Promise<ParcelsTableRow[]> => {
        return await getParcelsData(
            supabase,
            primaryFilters.concat(additionalFilters),
            sortState,
            undefined,
            undefined,
            checkedParcelIds
        );
    };

    return (
        <>
            <PreTableControls>
                <ControlContainer>
                    {/* NOTE: should probs move date range input back to top of page on UI somehow. <DateRangeInputs
                        range={packingDateRange}
                        setRange={setPackingDateRange}
                    ></DateRangeInputs> */}
                </ControlContainer>
                <ActionBar
                    fetchSelectedParcels={async (checkedParcelIds: string[]) =>
                        await getCheckedParcelsData(checkedParcelIds)
                    }
                    onDeleteParcels={deleteParcels}
                    willSaveParcelStatus={() => setIsLoading(true)}
                    hasSavedParcelStatus={() => setIsLoading(false)}
                    parcelIds={checkedParcelIds}
                />
            </PreTableControls>
            <TableSurface>
                <Table
                    dataPortion={parcelsDataPortion}
                    paginationConfig={{
                        pagination: true,
                        totalRows: totalRows,
                        onPageChange: setCurrentPage,
                        onPerPageChange: setPerPage,
                    }}
                    headerKeysAndLabels={parcelTableHeaderKeysAndLabels}
                    columnDisplayFunctions={parcelTableColumnDisplayFunctions}
                    columnStyleOptions={parcelTableColumnStyleOptions}
                    onRowClick={onParcelTableRowClick}
                    sortConfig={{
                        sortShown: true,
                        sortableColumns: sortableColumns,
                        setSortState: setSortState,
                    }}
                    filterConfig={{
                        primaryFiltersShown: true,
                        additionalFiltersShown: true,
                        primaryFilters: primaryFilters,
                        additionalFilters: additionalFilters,
                        setPrimaryFilters: setPrimaryFilters,
                        setAdditionalFilters: setAdditionalFilters,
                    }}
                    defaultShownHeaders={defaultShownHeaders}
                    toggleableHeaders={toggleableHeaders}
                    checkboxConfig={{
                        displayed: true,
                        selectedRowIds: checkedParcelIds,
                        isAllCheckboxChecked: isAllCheckBoxSelected,
                        onCheckboxClicked: (parcelData) => selectOrDeselectRow(parcelData.parcelId),
                        onAllCheckboxClicked: () => toggleAllCheckBox(),
                        isRowChecked: (parcelData) =>
                            checkedParcelIds.includes(parcelData.parcelId),
                    }}
                    editableConfig={{ editable: false }}
                />
            </TableSurface>
            <Modal
                header={
                    <>
                        <Icon icon={faBoxArchive} color={theme.primary.largeForeground[2]} />{" "}
                        Details
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
    );
};

export default ParcelsPage;
