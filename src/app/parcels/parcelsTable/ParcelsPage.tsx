"use client";

import { Row, ServerPaginatedTable } from "@/components/Tables/Table";
import React, { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "styled-components";
import { ParcelsTableRow, ParcelsSortState, ParcelsFilter, SelectedClientDetails } from "./types";
import ExpandedParcelDetails from "@/app/parcels/ExpandedParcelDetails";
import ExpandedParcelDetailsFallback from "@/app/parcels/ExpandedParcelDetailsFallback";
import Icon from "@/components/Icons/Icon";
import { faBoxArchive } from "@fortawesome/free-solid-svg-icons";
import Modal from "@/components/Modal/Modal";
import TableSurface from "@/components/Tables/TableSurface";
import ActionAndStatusBar from "@/app/parcels/ActionBar/ActionAndStatusBar";
import { Centerer, ContentDiv, OutsideDiv } from "@/components/Modal/ModalFormStyles";
import LinkButton from "@/components/Buttons/LinkButton";
import supabase from "@/supabaseClient";
import {
    getClientIdAndIsActive,
    getParcelIds,
    getParcelsByIds,
    getParcelsDataAndCount,
} from "./fetchParcelTableData";
import { StatusType, saveParcelStatus, SaveParcelStatusResult } from "../ActionBar/Statuses";
import { useRouter, useSearchParams } from "next/navigation";
import { CircularProgress } from "@mui/material";
import { ErrorSecondaryText } from "../../errorStylingandMessages";
import { subscriptionStatusRequiresErrorMessage } from "@/common/subscriptionStatusRequiresErrorMessage";
import buildFilters from "@/app/parcels/parcelsTable/filters";
import { ActionsContainer } from "@/components/Form/formStyling";
import parcelsSortableColumns from "./sortableColumns";
import {
    parcelIdParam,
    defaultNumberOfParcelsPerPage,
    numberOfParcelsPerPageOptions,
} from "./constants";
import { parcelTableHeaderKeysAndLabels, defaultShownHeaders, toggleableHeaders } from "./headers";
import {
    getSelectedParcelCountMessage,
    getParcelDataErrorMessage,
    parcelTableColumnDisplayFunctions,
    getClientIdAndIsActiveErrorMessage,
} from "./format";
import { PreTableControls, parcelTableColumnStyleOptions } from "./styles";
import { DbParcelRow } from "@/databaseUtils";

const ParcelsPage: React.FC<{}> = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [parcelsDataPortion, setParcelsDataPortion] = useState<ParcelsTableRow[]>([]);
    const [filteredParcelCount, setFilteredParcelCount] = useState<number>(0);
    const [selectedParcelId, setSelectedParcelId] = useState<string | null>(null);
    const [selectedClientDetails, setSelectedClientDetails] =
        useState<SelectedClientDetails | null>(null);

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

    const [primaryFilters, setPrimaryFilters] = useState<ParcelsFilter<any>[]>([]);
    const [additionalFilters, setAdditionalFilters] = useState<ParcelsFilter<any>[]>([]);

    const [areFiltersLoadingForFirstTime, setAreFiltersLoadingForFirstTime] =
        useState<boolean>(true);

    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [modalErrorMessage, setModalErrorMessage] = useState<string | null>(null);

    const parcelsTableFetchAbortController = useRef<AbortController | null>(null);

    const selectedParcelMessage = getSelectedParcelCountMessage(checkedParcelIds.length);

    const fetchAndSetClientDetailsForSelectedParcel = useCallback(async (): Promise<void> => {
        if (parcelId === null) {
            return;
        }

        const { data, error } = await getClientIdAndIsActive(parcelId);
        if (error) {
            setModalErrorMessage(getClientIdAndIsActiveErrorMessage(error));
        } else {
            setSelectedClientDetails(data);
        }
    }, [parcelId]);

    useEffect(() => {
        if (parcelId) {
            setSelectedParcelId(parcelId);
            setModalIsOpen(true);
        }
    }, [parcelId]);

    useEffect(() => {
        setSelectedClientDetails(null);
        void fetchAndSetClientDetailsForSelectedParcel();
    }, [fetchAndSetClientDetailsForSelectedParcel]);

    useEffect(() => {
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

    const onParcelTableRowClick = (row: Row<ParcelsTableRow>): void => {
        setSelectedParcelId(row.data.parcelId);
        router.push(`/parcels?${parcelIdParam}=${row.data.parcelId}`);
    };

    const updateParcelStatuses = async (
        parcels: ParcelsTableRow[],
        newStatus: StatusType,
        statusEventData?: string,
        action?: string
    ): Promise<SaveParcelStatusResult> => {
        const { error } = await saveParcelStatus(
            parcels.map((parcel) => parcel.parcelId),
            newStatus,
            statusEventData,
            parcels.map((parcel) => parcel.clientId),
            action
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
                        <ServerPaginatedTable<ParcelsTableRow, DbParcelRow>
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
                                sortableColumns: parcelsSortableColumns,
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
                        footer={
                            <Centerer>
                                <LinkButton link={`/parcels/edit/${selectedParcelId}`}>
                                    Edit Parcel
                                </LinkButton>
                                {selectedClientDetails && (
                                    <>
                                        <LinkButton
                                            link={`/clients?clientId=${selectedClientDetails.clientId}`}
                                            disabled={!selectedClientDetails.isClientActive}
                                        >
                                            See Client Details
                                        </LinkButton>
                                        <LinkButton
                                            link={`/clients/edit/${selectedClientDetails.clientId}`}
                                            disabled={!selectedClientDetails.isClientActive}
                                        >
                                            Edit Client Details
                                        </LinkButton>
                                    </>
                                )}
                            </Centerer>
                        }
                    >
                        <OutsideDiv>
                            <ContentDiv>
                                <Suspense fallback={<ExpandedParcelDetailsFallback />}>
                                    <ExpandedParcelDetails parcelId={selectedParcelId} />
                                </Suspense>
                            </ContentDiv>
                            {modalErrorMessage && (
                                <ErrorSecondaryText>{modalErrorMessage}</ErrorSecondaryText>
                            )}
                        </OutsideDiv>
                    </Modal>
                </>
            )}
        </>
    );
};

export default ParcelsPage;
