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
    RequestParams,
    areRequestsIdentical,
    getParcelIds,
    getParcelsCount,
    getParcelsData,
} from "./fetchParcelTableData";
import dayjs from "dayjs";
import { checklistFilter } from "@/components/Tables/ChecklistFilter";
import { Filter, PaginationType } from "@/components/Tables/Filters";
import { saveParcelStatus } from "./ActionBar/Statuses";
import { useRouter, useSearchParams } from "next/navigation";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import { Database } from "@/databaseTypesFile";
import { buildTextFilter } from "@/components/Tables/TextFilter";
import { dateFilter } from "@/components/Tables/DateFilter";
import { CircularProgress } from "@mui/material";
import { logErrorReturnLogId } from "@/logger/logger";
import { DatabaseError } from "@/app/errorClasses";

interface packingSlotOptionsSet {
    key: string;
    value: string;
}

export const parcelTableHeaderKeysAndLabels: TableHeaders<ParcelsTableRow> = [
    ["iconsColumn", "Flags"],
    ["fullName", "Name"],
    ["familyCategory", "Family"],
    ["addressPostcode", "Postcode"],
    ["phoneNumber", "Phone"],
    ["voucherNumber", "Voucher"],
    ["deliveryCollection", "Collection"],
    ["packingDate", "Packing Date"],
    ["packingSlot", "Packing Slot"],
    ["lastStatus", "Last Status"],
];

const defaultShownHeaders: (keyof ParcelsTableRow)[] = [
    "fullName",
    "familyCategory",
    "addressPostcode",
    "deliveryCollection",
    "packingDate",
    "packingSlot",
    "lastStatus",
];

const sortableColumns: SortOptions<ParcelsTableRow>[] = [
    {
        key: "fullName",
        sortMethodConfig: {
            method: (query, sortDirection) =>
                query.order("client_full_name", { ascending: sortDirection === "asc" }),
            paginationType: PaginationType.Server,
        },
    },
    {
        key: "familyCategory",
        sortMethodConfig: {
            method: (query, sortDirection) =>
                query.order("family_count", { ascending: sortDirection === "asc" }),
            paginationType: PaginationType.Server,
        },
    },
    {
        key: "addressPostcode",
        sortMethodConfig: {
            method: (query, sortDirection) =>
                query.order("client_address_postcode", { ascending: sortDirection === "asc" }),
            paginationType: PaginationType.Server,
        },
    },
    {
        key: "phoneNumber",
        sortMethodConfig: {
            method: (query, sortDirection) =>
                query.order("client_phone_number", { ascending: sortDirection === "asc" }),
            paginationType: PaginationType.Server,
        },
    },
    {
        key: "voucherNumber",
        sortMethodConfig: {
            method: (query, sortDirection) =>
                query.order("voucher_number", { ascending: sortDirection === "asc" }),
            paginationType: PaginationType.Server,
        },
    },
    {
        key: "deliveryCollection",
        sortMethodConfig: {
            method: (query, sortDirection) =>
                query.order("collection_centre_name", { ascending: sortDirection === "asc" }),
            paginationType: PaginationType.Server,
        },
    },
    {
        key: "packingDate",
        sortMethodConfig: {
            method: (query, sortDirection) =>
                query.order("packing_date", { ascending: sortDirection === "asc" }),
            paginationType: PaginationType.Server,
        },
    },
    {
        key: "packingSlot",
        sortMethodConfig: {
            method: (query, sortDirection) =>
                query.order("packing_slot_order", { ascending: sortDirection === "asc" }),
            paginationType: PaginationType.Server,
        },
    },
    {
        key: "lastStatus",
        sortMethodConfig: {
            method: (query, sortDirection) =>
                query.order("last_status_workflow_order", { ascending: sortDirection === "asc" }),
            paginationType: PaginationType.Server,
        },
    },
];

const toggleableHeaders: (keyof ParcelsTableRow)[] = [
    "fullName",
    "familyCategory",
    "addressPostcode",
    "phoneNumber",
    "voucherNumber",
    "deliveryCollection",
    "packingDate",
    "packingSlot",
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
    packingDate: {
        hide: 800,
    },
    packingSlot: {
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

const fullNameSearch = (
    query: PostgrestFilterBuilder<Database["public"], any, any>,
    state: string
): PostgrestFilterBuilder<Database["public"], any, any> => {
    return query.ilike("client_full_name", `%${state}%`);
};

const postcodeSearch = (
    query: PostgrestFilterBuilder<Database["public"], any, any>,
    state: string
): PostgrestFilterBuilder<Database["public"], any, any> => {
    return query.ilike("client_address_postcode", `%${state}%`);
};

const familySearch = (
    query: PostgrestFilterBuilder<Database["public"], any, any>,
    state: string
): PostgrestFilterBuilder<Database["public"], any, any> => {
    if (state === "") {
        return query;
    }
    if ("single".includes(state.toLowerCase())) {
        return query.lte("family_count", 1);
    }
    if ("family of".includes(state.toLowerCase())) {
        return query.gte("family_count", 2);
    }
    const stateAsNumber = Number(state);
    if (Number.isNaN(stateAsNumber) || stateAsNumber === 0) {
        return query.eq("family_count", -1);
    }
    if (stateAsNumber >= 10) {
        return query.gte("family_count", 10);
    }
    if (stateAsNumber === 1) {
        return query.lte("family_count", 1);
    }
    return query.eq("family_count", Number(state));
};

const phoneSearch = (
    query: PostgrestFilterBuilder<Database["public"], any, any>,
    state: string
): PostgrestFilterBuilder<Database["public"], any, any> => {
    return query.ilike("client_phone_number", `%${state}%`);
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
        return query.gte("packing_date", state.from).lte("packing_date", state.to);
    };
    return dateFilter<ParcelsTableRow>({
        key: "packingDate",
        label: "",
        methodConfig: { paginationType: PaginationType.Server, method: dateSearch },
        initialState: initialState,
    });
};

const buildDeliveryCollectionFilter = async (): Promise<Filter<ParcelsTableRow, string[]>> => {
    const deliveryCollectionSearch = (
        query: PostgrestFilterBuilder<Database["public"], any, any>,
        state: string[]
    ): PostgrestFilterBuilder<Database["public"], any, any> => {
        return query.in("collection_centre_acronym", state);
    };

    const keySet = new Set();
    const { data, error } = await supabase
        .from("parcels_plus")
        .select("collection_centre_name, collection_centre_acronym");
    if (error) {
        const logId = await logErrorReturnLogId(
            "Error with fetch: Collection centre filter options",
            error
        );
        throw new DatabaseError("fetch", "collection centre filter options", logId);
    }
    const optionsResponse = data ?? [];
    const optionsSet: CollectionCentresOptions[] = optionsResponse.reduce<
        CollectionCentresOptions[]
    >((filteredOptions, row) => {
        if (
            row?.collection_centre_acronym &&
            row.collection_centre_name &&
            !keySet.has(row.collection_centre_acronym)
        ) {
            keySet.add(row.collection_centre_acronym);
            filteredOptions.push({
                name: row.collection_centre_name,
                acronym: row.collection_centre_acronym,
            });
        }
        return filteredOptions.sort();
    }, []);

    return checklistFilter<ParcelsTableRow>({
        key: "deliveryCollection",
        filterLabel: "Collection",
        itemLabelsAndKeys: optionsSet.map((option) => [option!.name, option!.acronym]),
        initialCheckedKeys: optionsSet.map((option) => option!.acronym),
        methodConfig: { paginationType: PaginationType.Server, method: deliveryCollectionSearch },
    });
};

const buildLastStatusFilter = async (): Promise<Filter<ParcelsTableRow, string[]>> => {
    const lastStatusSearch = (
        query: PostgrestFilterBuilder<Database["public"], any, any>,
        state: string[]
    ): PostgrestFilterBuilder<Database["public"], any, any> => {
        if (state.includes("None")) {
            return query.or(
                `last_status_event_name.is.null,last_status_event_name.in.(${state.join(",")})`
            );
        } else {
            return query.in("last_status_event_name", state);
        }
    };

    const keySet = new Set();
    const { data, error } = await supabase.from("status_order").select("event_name");
    if (error) {
        const logId = await logErrorReturnLogId("Error with fetch: Last status filter options");
        throw new DatabaseError("fetch", "last status filter options", logId);
    }
    const optionsResponse = data ?? [];
    const optionsSet: string[] = optionsResponse.reduce<string[]>((filteredOptions, row) => {
        if (row.event_name && !keySet.has(row.event_name)) {
            keySet.add(row.event_name);
            filteredOptions.push(row.event_name);
        }
        return filteredOptions.sort();
    }, []);
    data && optionsSet.push("None");

    return checklistFilter<ParcelsTableRow>({
        key: "lastStatus",
        filterLabel: "Last Status",
        itemLabelsAndKeys: optionsSet.map((value) => [value, value]),
        initialCheckedKeys: optionsSet.filter((option) => option !== "Request Deleted"),
        methodConfig: { paginationType: PaginationType.Server, method: lastStatusSearch },
    });
};

const buildPackingSlotFilter = async (): Promise<Filter<ParcelsTableRow, string[]>> => {
    const packingSlotSearch = (
        query: PostgrestFilterBuilder<Database["public"], any, any>,
        state: string[]
    ): PostgrestFilterBuilder<Database["public"], any, any> => {
        return query.in("packing_slot_name", state);
    };

    const keySet = new Set();

    const { data, error } = await supabase.from("packing_slots").select("name, is_shown");
    if (error) {
        const logId = await logErrorReturnLogId(
            "Error with fetch: Packing slot filter options",
            error
        );
        throw new DatabaseError("fetch", "packing slot filter options", logId);
    }

    const optionsResponse = data ?? [];

    const optionsSet = optionsResponse.reduce<packingSlotOptionsSet[]>((filteredOptions, row) => {
        if (!row.name || keySet.has(row.name)) {
            return filteredOptions;
        }

        if (row.is_shown) {
            keySet.add(row.name);
            filteredOptions.push({ key: row.name, value: row.name });
        } else {
            keySet.add(row.name);
            filteredOptions.push({ key: row.name, value: `${row.name} (inactive)` });
        }

        return filteredOptions;
    }, []);

    optionsSet.sort();

    return checklistFilter<ParcelsTableRow>({
        key: "packingSlot",
        filterLabel: "Packing Slot",
        itemLabelsAndKeys: optionsSet.map((option) => [option.value, option.key]),
        initialCheckedKeys: optionsSet.map((option) => option.key),
        methodConfig: { paginationType: PaginationType.Server, method: packingSlotSearch },
    });
};

const ParcelsPage: React.FC<{}> = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [parcelsDataPortion, setParcelsDataPortion] = useState<ParcelsTableRow[]>([]);
    const [filteredParcelCount, setFilteredParcelCount] = useState<number>(0);
    const [selectedParcelId, setSelectedParcelId] = useState<string | null>(null);

    const [checkedParcelIds, setCheckedParcelIds] = useState<string[]>([]);
    const [isAllCheckBoxSelected, setAllCheckBoxSelected] = useState(false);
    const fetchParcelsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const theme = useTheme();
    const router = useRouter();

    const searchParams = useSearchParams();
    const parcelId = searchParams.get(parcelIdParam);

    const [sortState, setSortState] = useState<SortState<ParcelsTableRow>>({ sortEnabled: false });

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

    const [areFiltersLoadingForFirstTime, setAreFiltersLoadingForFirstTime] =
        useState<boolean>(true);

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
                    methodConfig: { paginationType: PaginationType.Server, method: fullNameSearch },
                }),
                buildTextFilter({
                    key: "addressPostcode",
                    label: "Postcode",
                    headers: parcelTableHeaderKeysAndLabels,
                    methodConfig: { paginationType: PaginationType.Server, method: postcodeSearch },
                }),
                await buildDeliveryCollectionFilter(),
            ];

            const additionalFilters = [
                buildTextFilter({
                    key: "familyCategory",
                    label: "Family",
                    headers: parcelTableHeaderKeysAndLabels,
                    methodConfig: { paginationType: PaginationType.Server, method: familySearch },
                }),
                buildTextFilter({
                    key: "phoneNumber",
                    label: "Phone",
                    headers: parcelTableHeaderKeysAndLabels,
                    methodConfig: { paginationType: PaginationType.Server, method: phoneSearch },
                }),
                buildTextFilter({
                    key: "voucherNumber",
                    label: "Voucher",
                    headers: parcelTableHeaderKeysAndLabels,
                    methodConfig: { paginationType: PaginationType.Server, method: voucherSearch },
                }),
                await buildLastStatusFilter(),
                await buildPackingSlotFilter(),
            ];
            return { primaryFilters: primaryFilters, additionalFilters: additionalFilters };
        };
        (async () => {
            setAreFiltersLoadingForFirstTime(true);
            const filtersObject = await buildFilters();
            setPrimaryFilters(filtersObject.primaryFilters);
            setAdditionalFilters(filtersObject.additionalFilters);
            setAreFiltersLoadingForFirstTime(false);
        })();
    }, []);

    useEffect(() => {
        if (!areFiltersLoadingForFirstTime) {
            const allFilters = [...primaryFilters, ...additionalFilters];
            const initialRequestParams: RequestParams<ParcelsTableRow> = {
                allFilters: { ...allFilters },
                sortState: { ...sortState },
                startPoint: startPoint,
                endPoint: endPoint,
            };
            (async () => {
                setIsLoading(true);
                const filteredParcelCount = await getParcelsCount(supabase, allFilters);
                const fetchedData = await getParcelsData(
                    supabase,
                    allFilters,
                    sortState,
                    startPoint,
                    endPoint
                );
                const requestParams: RequestParams<ParcelsTableRow> = {
                    allFilters: { ...allFilters },
                    sortState: { ...sortState },
                    startPoint: startPoint,
                    endPoint: endPoint,
                };
                if (areRequestsIdentical(requestParams, initialRequestParams)) {
                    setFilteredParcelCount(filteredParcelCount);
                    setParcelsDataPortion(fetchedData);
                }
                setIsLoading(false);
            })();
        }
    }, [
        startPoint,
        endPoint,
        primaryFilters,
        additionalFilters,
        sortState,
        areFiltersLoadingForFirstTime,
    ]);

    useEffect(() => {
        // This requires that the DB parcels, events, families, clients and collection_centres tables have Realtime turned on
        if (!areFiltersLoadingForFirstTime) {
            const allFilters = [...primaryFilters, ...additionalFilters];
            const loadCountAndDataWithTimer = async (): Promise<void> => {
                if (fetchParcelsTimer.current) {
                    clearTimeout(fetchParcelsTimer.current);
                    fetchParcelsTimer.current = null;
                }

                setIsLoading(true);
                fetchParcelsTimer.current = setTimeout(async () => {
                    setFilteredParcelCount(await getParcelsCount(supabase, allFilters));
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
                .on(
                    "postgres_changes",
                    { event: "*", schema: "public", table: "families" },
                    loadCountAndDataWithTimer
                )
                .on(
                    "postgres_changes",
                    { event: "*", schema: "public", table: "collection_centres" },
                    loadCountAndDataWithTimer
                )
                .on(
                    "postgres_changes",
                    { event: "*", schema: "public", table: "clients" },
                    loadCountAndDataWithTimer
                )
                .subscribe();

            return () => {
                supabase.removeChannel(subscriptionChannel);
            };
        }
    }, [
        endPoint,
        startPoint,
        primaryFilters,
        additionalFilters,
        sortState,
        areFiltersLoadingForFirstTime,
    ]);

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
        const allChecked = checkedParcelIds.length === filteredParcelCount;
        if (allChecked !== isAllCheckBoxSelected) {
            setAllCheckBoxSelected(allChecked);
        }
    }, [filteredParcelCount, checkedParcelIds, isAllCheckBoxSelected]);

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
            return "None";
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
        packingDate: formatDatetimeAsDate,
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
                <ControlContainer />
                <ActionBar
                    fetchParcelsByIds={getCheckedParcelsData}
                    onDeleteParcels={deleteParcels}
                    willSaveParcelStatus={() => setIsLoading(true)}
                    hasSavedParcelStatus={() => setIsLoading(false)}
                    parcelIds={checkedParcelIds}
                />
            </PreTableControls>
            {areFiltersLoadingForFirstTime ? (
                <Centerer>
                    <CircularProgress aria-label="table-initial-progress-bar" />
                </Centerer>
            ) : (
                <TableSurface>
                    <Table
                        dataPortion={parcelsDataPortion}
                        isLoading={isLoading}
                        paginationConfig={{
                            enablePagination: true,
                            filteredCount: filteredParcelCount,
                            onPageChange: setCurrentPage,
                            onPerPageChange: setPerPage,
                        }}
                        headerKeysAndLabels={parcelTableHeaderKeysAndLabels}
                        columnDisplayFunctions={parcelTableColumnDisplayFunctions}
                        columnStyleOptions={parcelTableColumnStyleOptions}
                        onRowClick={onParcelTableRowClick}
                        sortConfig={{
                            sortPossible: true,
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
                            onCheckboxClicked: (parcelData) =>
                                selectOrDeselectRow(parcelData.parcelId),
                            onAllCheckboxClicked: () => toggleAllCheckBox(),
                            isRowChecked: (parcelData) =>
                                checkedParcelIds.includes(parcelData.parcelId),
                        }}
                        editableConfig={{ editable: false }}
                        pointerOnHover={true}
                    />
                </TableSurface>
            )}
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
