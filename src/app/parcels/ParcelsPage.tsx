"use client";

import Table, { Row, SortOptions, TableHeaders } from "@/components/Tables/Table";
import React, { Suspense, useCallback, useEffect, useRef, useState } from "react";
import styled, { useTheme } from "styled-components";
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
import ActionAndStatusBar from "@/app/parcels/ActionBar/ActionAndStatusBar";
import { ButtonsDiv, Centerer, ContentDiv, OutsideDiv } from "@/components/Modal/ModalFormStyles";
import LinkButton from "@/components/Buttons/LinkButton";
import supabase from "@/supabaseClient";
import {
    DBParcelRow,
    GetParcelDataAndCountErrorType,
    ParcelsFilter,
    ParcelsSortState,
    getParcelIds,
    getParcelsByIds,
    getParcelsDataAndCount,
} from "./fetchParcelTableData";
import dayjs from "dayjs";
import { PaginationType } from "@/components/Tables/Filters";
import { StatusType, saveParcelStatus, SaveParcelStatusResult } from "./ActionBar/Statuses";
import { useRouter, useSearchParams } from "next/navigation";
import { buildTextFilter } from "@/components/Tables/TextFilter";
import { CircularProgress } from "@mui/material";
import { logErrorReturnLogId } from "@/logger/logger";
import { ErrorSecondaryText } from "../errorStylingandMessages";
import { subscriptionStatusRequiresErrorMessage } from "@/common/subscriptionStatusRequiresErrorMessage";
import {
    buildDateFilter,
    buildDeliveryCollectionFilter,
    buildLastStatusFilter,
    buildPackingSlotFilter,
    familySearch,
    fullNameSearch,
    phoneSearch,
    postcodeSearch,
    voucherSearch,
} from "@/app/parcels/parcelsTableFilters";
import { ActionsContainer } from "@/components/Form/formStyling";
import { formatDateTime, formatDatetimeAsDate, nullPostcodeDisplay } from "@/common/format";

export const parcelTableHeaderKeysAndLabels: TableHeaders<ParcelsTableRow> = [
    ["iconsColumn", ""],
    ["fullName", "Name"],
    ["familyCategory", "Family"],
    ["addressPostcode", "Postcode"],
    ["phoneNumber", "Phone"],
    ["voucherNumber", "Voucher"],
    ["deliveryCollection", "Method"],
    ["packingDate", "Packing Date"],
    ["packingSlot", "Packing Slot"],
    ["lastStatus", "Last Status"],
    ["createdAt", "Created At"],
];

const defaultShownHeaders: (keyof ParcelsTableRow)[] = [
    "iconsColumn",
    "fullName",
    "familyCategory",
    "addressPostcode",
    "deliveryCollection",
    "packingDate",
    "packingSlot",
    "lastStatus",
];

const sortableColumns: SortOptions<ParcelsTableRow, DBParcelRow>[] = [
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
                query
                    .order("packing_date", { ascending: sortDirection === "asc" })
                    .order("packing_slot_order")
                    .order("client_full_name"),
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
    {
        key: "createdAt",
        sortMethodConfig: {
            method: (query, sortDirection) =>
                query.order("created_at", { ascending: sortDirection === "asc" }),
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
    "createdAt",
];

const parcelTableColumnStyleOptions = {
    iconsColumn: {
        width: "4rem",
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

function getSelectedParcelCountMessage(numberOfSelectedParcels: number): string | null {
    if (numberOfSelectedParcels === 0) {
        return null;
    }
    return numberOfSelectedParcels === 1
        ? "1 parcel selected"
        : `${numberOfSelectedParcels} parcels selected`;
}

async function getClientIdForSelectedParcel(parcelId: string): Promise<string> {
    const { data, error } = await supabase
        .from("parcels")
        .select("client_id")
        .eq("primary_key", parcelId)
        .single();

    if (error) {
        const message = `Failed to fetch client ID for a parcel with ID ${parcelId}`;
        const logId = await logErrorReturnLogId(message, { error });
        throw new Error(message + ` Log ID: ${logId}`);
    }

    return data.client_id;
}

function getParcelDataErrorMessage(errorType: GetParcelDataAndCountErrorType): string | null {
    switch (errorType) {
        case "unknownError":
            return "Unknown error has occurred. Please reload.";
        case "failedToFetchParcels":
            return "Failed to fetch parcels. Please reload.";
        case "abortedFetch":
            return null;
    }
}

const parcelIdParam = "parcelId";

const defaultNumberOfParcelsPerPage = 100;
const numberOfParcelsPerPageOptions = [10, 25, 50, 100];

const ParcelsPage: React.FC<{}> = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [parcelsDataPortion, setParcelsDataPortion] = useState<ParcelsTableRow[]>([]);
    const [filteredParcelCount, setFilteredParcelCount] = useState<number>(0);
    const [selectedParcelId, setSelectedParcelId] = useState<string | null>(null);
    const [clientIdForSelectedParcel, setClientIdForSelectedParcel] = useState<string | null>(null);

    const [checkedParcelIds, setCheckedParcelIds] = useState<string[]>([]);
    const [isAllCheckBoxSelected, setAllCheckBoxSelected] = useState(false);
    const fetchParcelsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const theme = useTheme();
    const router = useRouter();

    const searchParams = useSearchParams();
    const parcelId = searchParams.get(parcelIdParam);

    const [sortState, setSortState] = useState<ParcelsSortState>({ sortEnabled: false });

    const [parcelCountPerPage, setParcelCountPerPage] = useState(defaultNumberOfParcelsPerPage);
    const [currentPage, setCurrentPage] = useState(1);
    const startPoint = (currentPage - 1) * parcelCountPerPage;
    const endPoint = currentPage * parcelCountPerPage - 1;

    const [primaryFilters, setPrimaryFilters] = useState<ParcelsFilter[]>([]);
    const [additionalFilters, setAdditionalFilters] = useState<ParcelsFilter[]>([]);

    const [areFiltersLoadingForFirstTime, setAreFiltersLoadingForFirstTime] =
        useState<boolean>(true);

    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const parcelsTableFetchAbortController = useRef<AbortController | null>(null);

    const selectedParcelMessage = getSelectedParcelCountMessage(checkedParcelIds.length);

    const fetchAndSetClientIdForSelectedParcel = useCallback((): void => {
        if (parcelId === null) {
            return;
        }

        getClientIdForSelectedParcel(parcelId)
            .then((clientId) => setClientIdForSelectedParcel(clientId))
            .catch((error) => {
                if (error instanceof Error) {
                    setErrorMessage(error.message);
                }
            });
    }, [parcelId]);

    useEffect(() => {
        if (parcelId) {
            setSelectedParcelId(parcelId);
            setModalIsOpen(true);
        }
    }, [parcelId]);

    useEffect(() => {
        setClientIdForSelectedParcel(null);
        void fetchAndSetClientIdForSelectedParcel();
    }, [fetchAndSetClientIdForSelectedParcel]);

    useEffect(() => {
        const buildFilters = async (): Promise<{
            primaryFilters: ParcelsFilter[];
            additionalFilters: ParcelsFilter[];
        }> => {
            const today = dayjs();
            const dateFilter = buildDateFilter({
                from: today,
                to: today,
            });
            const primaryFilters: ParcelsFilter[] = [
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

    const fetchAndDisplayParcelsData = useCallback(async (): Promise<void> => {
        const allFilters = [...primaryFilters, ...additionalFilters];

        if (parcelsTableFetchAbortController.current) {
            parcelsTableFetchAbortController.current.abort("stale request");
        }

        parcelsTableFetchAbortController.current = new AbortController();

        if (parcelsTableFetchAbortController.current) {
            setErrorMessage(null);
            setIsLoading(true);

            const { data, error } = await getParcelsDataAndCount(
                supabase,
                allFilters,
                sortState,
                parcelsTableFetchAbortController.current.signal,
                startPoint,
                endPoint
            );

            if (error) {
                const newErrorMessage = getParcelDataErrorMessage(error.type);
                if (newErrorMessage !== null) {
                    setErrorMessage(`${newErrorMessage} Log ID: ${error.logId}`);
                }
            } else {
                setParcelsDataPortion(data.parcelTableRows);
                setFilteredParcelCount(data.count);
            }

            parcelsTableFetchAbortController.current = null;
            setIsLoading(false);
        }
    }, [additionalFilters, endPoint, primaryFilters, sortState, startPoint]);

    useEffect(() => {
        if (!areFiltersLoadingForFirstTime) {
            void fetchAndDisplayParcelsData();
        }
    }, [areFiltersLoadingForFirstTime, fetchAndDisplayParcelsData]);

    const loadCountAndDataWithTimer = (): void => {
        if (fetchParcelsTimer.current) {
            clearTimeout(fetchParcelsTimer.current);
            fetchParcelsTimer.current = null;
        }

        setIsLoading(true);
        fetchParcelsTimer.current = setTimeout(() => {
            void fetchAndDisplayParcelsData();
        }, 500);
    };

    useEffect(() => {
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
            .subscribe((status, err) => {
                subscriptionStatusRequiresErrorMessage(status, err, "website_data") &&
                    setErrorMessage("Error fetching data, please reload");
            });

        return () => {
            void supabase.removeChannel(subscriptionChannel);
        };
    });

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
            return "";
        }
        const { name, eventData, timestamp } = data;
        return (
            `${name}` +
            (eventData ? ` (${eventData})` : "") +
            ` @ ${formatDatetimeAsDate(timestamp)}`
        );
    };

    const formatNullPostcode = (postcodeData: ParcelsTableRow["addressPostcode"]): string => {
        return postcodeData ?? nullPostcodeDisplay;
    };

    const parcelTableColumnDisplayFunctions = {
        iconsColumn: rowToIconsColumn,
        deliveryCollection: rowToDeliveryCollectionColumn,
        packingDate: formatDatetimeAsDate,
        lastStatus: rowToLastStatusColumn,
        addressPostcode: formatNullPostcode,
        createdAt: formatDateTime,
    };

    const onParcelTableRowClick = (row: Row<ParcelsTableRow>): void => {
        setSelectedParcelId(row.data.parcelId);
        router.push(`/parcels?${parcelIdParam}=${row.data.parcelId}`);
    };

    const updateParcelStatuses = async (
        parcels: ParcelsTableRow[],
        newStatus: StatusType,
        statusEventData?: string
    ): Promise<SaveParcelStatusResult> => {
        const { error } = await saveParcelStatus(
            parcels.map((parcel) => parcel.parcelId),
            newStatus,
            statusEventData
        );
        setCheckedParcelIds([]);
        return { error: error };
    };

    const getCheckedParcelsData = async (): Promise<ParcelsTableRow[]> => {
        if (checkedParcelIds.length === 0) {
            return [];
        }

        return await getParcelsByIds(
            supabase,
            primaryFilters.concat(additionalFilters),
            sortState,
            checkedParcelIds
        );
    };

    return (
        <>
            <PreTableControls>
                <ActionsContainer>
                    {selectedParcelMessage && <span>{selectedParcelMessage}</span>}

                    <ActionAndStatusBar
                        fetchSelectedParcels={getCheckedParcelsData}
                        updateParcelStatuses={updateParcelStatuses}
                    />
                </ActionsContainer>
            </PreTableControls>
            {areFiltersLoadingForFirstTime ? (
                <Centerer>
                    <CircularProgress aria-label="table-initial-progress-bar" />
                </Centerer>
            ) : (
                <>
                    {errorMessage && <ErrorSecondaryText>{errorMessage}</ErrorSecondaryText>}
                    <TableSurface>
                        <Table
                            dataPortion={parcelsDataPortion}
                            isLoading={isLoading}
                            paginationConfig={{
                                enablePagination: true,
                                filteredCount: filteredParcelCount,
                                onPageChange: setCurrentPage,
                                onPerPageChange: setParcelCountPerPage,
                                defaultRowsPerPage: defaultNumberOfParcelsPerPage,
                                rowsPerPageOptions: numberOfParcelsPerPageOptions,
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
                                    {clientIdForSelectedParcel && (
                                        <LinkButton
                                            link={`/clients?clientId=${clientIdForSelectedParcel}`}
                                        >
                                            See Client Details
                                        </LinkButton>
                                    )}
                                    {clientIdForSelectedParcel && (
                                        <LinkButton
                                            link={`/clients/edit/${clientIdForSelectedParcel}`}
                                        >
                                            Edit Client Details
                                        </LinkButton>
                                    )}
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
