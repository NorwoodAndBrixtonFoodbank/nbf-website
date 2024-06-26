"use client";

import LinkButton from "@/components/Buttons/LinkButton";
import Icon from "@/components/Icons/Icon";
import Modal from "@/components/Modal/Modal";
import { ButtonsDiv, Centerer, ContentDiv, OutsideDiv } from "@/components/Modal/ModalFormStyles";
import { ServerPaginatedTable } from "@/components/Tables/Table";
import TableSurface from "@/components/Tables/TableSurface";
import supabase from "@/supabaseClient";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState, Suspense, useRef, useCallback } from "react";
import { useTheme } from "styled-components";
import getClientsDataAndCount from "./getClientsData";
import { useSearchParams, useRouter } from "next/navigation";
import ExpandedClientDetails from "@/app/clients/ExpandedClientDetails";
import ExpandedClientDetailsFallback from "@/app/clients/ExpandedClientDetailsFallback";
import { CircularProgress } from "@mui/material";
import { ErrorSecondaryText } from "../../errorStylingandMessages";
import { subscriptionStatusRequiresErrorMessage } from "@/common/subscriptionStatusRequiresErrorMessage";
import { displayPostcodeForHomelessClient } from "@/common/format";
import ConfirmDialog from "@/components/Modal/ConfirmDialog";
import DeleteButton from "@/components/Buttons/DeleteButton";
import deleteClient from "../deleteClient";
import { getIsClientActive } from "../getExpandedClientDetails";
import clientsFilters from "./filters";
import clientsSortableColumns from "./sortableColumns";
import clientsHeaders from "./headers";
import { ClientsTableRow, ClientsSortState, ClientsFilter } from "./types";
import { DbClientRow } from "@/databaseUtils";
import { clientIdParam } from "./constants";
import { getIsClientActiveErrorMessage, getDeleteClientErrorMessage } from "./format";

const ClientsPage: React.FC<{}> = () => {
    const [isLoadingForFirstTime, setIsLoadingForFirstTime] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [clientsDataPortion, setClientsDataPortion] = useState<ClientsTableRow[]>([]);
    const [filteredClientCount, setFilteredClientCount] = useState<number>(0);
    const [sortState, setSortState] = useState<ClientsSortState>({ sortEnabled: false });
    const [primaryFilters, setPrimaryFilters] = useState<ClientsFilter[]>(clientsFilters);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const clientTableFetchAbortController = useRef<AbortController | null>(null);
    const [isSelectedClientActive, setIsSelectedClientActive] = useState<boolean | null>(null);
    const [isClientActiveErrorMessage, setIsClientActiveErrorMessage] = useState<string | null>(
        null
    );
    const [deleteClientErrorMessage, setDeleteClientErrorMessage] = useState<string | null>(null);
    const [isDeleteClientDialogOpen, setIsDeleteClientDialogOpen] = useState<boolean>(false);

    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const startPoint = (currentPage - 1) * perPage;
    const endPoint = currentPage * perPage - 1;

    const fetchAndDisplayClientsData = useCallback(async () => {
        setIsLoading(true);
        if (clientTableFetchAbortController.current) {
            clientTableFetchAbortController.current.abort("stale request");
        }
        clientTableFetchAbortController.current = new AbortController();
        if (clientTableFetchAbortController.current) {
            setErrorMessage(null);
            const { data, error } = await getClientsDataAndCount(
                supabase,
                startPoint,
                endPoint,
                primaryFilters,
                sortState,
                clientTableFetchAbortController.current.signal
            );

            if (error) {
                switch (error.type) {
                    case "abortedFetchingClientsTable":
                    case "abortedFetchingClientsTableCount":
                        return;
                    case "failedToFetchClientsTable":
                    case "failedToFetchClientsTableCount":
                        setErrorMessage(`Error occurred: ${error.type}, Log ID: 
                    ${error.logId}`);
                        break;
                }
            } else {
                setClientsDataPortion(data.clientData);
                setFilteredClientCount(data.count);
            }
            clientTableFetchAbortController.current = null;
            setIsLoading(false);
            setIsLoadingForFirstTime(false);
        }
    }, [startPoint, endPoint, primaryFilters, sortState]);

    useEffect(() => {
        void fetchAndDisplayClientsData();
    }, [fetchAndDisplayClientsData]);

    useEffect(() => {
        const subscriptionChannel = supabase
            .channel("parcels-table-changes")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "clients" },
                fetchAndDisplayClientsData
            )
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "collection_centres" },
                fetchAndDisplayClientsData
            )
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "families" },
                fetchAndDisplayClientsData
            )
            .subscribe((status, err) => {
                subscriptionStatusRequiresErrorMessage(status, err, "website_data") &&
                    setErrorMessage("Error fetching data, please reload");
            });

        return () => {
            void supabase.removeChannel(subscriptionChannel);
        };
    }, [startPoint, endPoint, primaryFilters, sortState, fetchAndDisplayClientsData]);

    const theme = useTheme();
    const router = useRouter();

    const searchParams = useSearchParams();
    const clientId = searchParams.get(clientIdParam);

    useEffect(() => {
        (async () => {
            setIsClientActiveErrorMessage(null);
            if (clientId) {
                const { isActive, error } = await getIsClientActive(clientId);
                if (error) {
                    setIsClientActiveErrorMessage(getIsClientActiveErrorMessage(error));
                    return;
                }
                setIsSelectedClientActive(isActive);
            }
        })();
    }, [clientId]);

    const formatNullPostcode = (postcodeData: ClientsTableRow["addressPostcode"]): string => {
        return postcodeData ?? displayPostcodeForHomelessClient;
    };

    const onDeleteClient = async (): Promise<void> => {
        if (clientId) {
            setDeleteClientErrorMessage(null);
            const { error: deleteClientError } = await deleteClient(clientId);
            setIsDeleteClientDialogOpen(false);
            if (deleteClientError) {
                setDeleteClientErrorMessage(getDeleteClientErrorMessage(deleteClientError));
                return;
            }
        }
    };

    return (
        <>
            {isLoadingForFirstTime ? (
                <Centerer>
                    <CircularProgress aria-label="table-initial-progress-bar" />
                </Centerer>
            ) : (
                <>
                    {errorMessage && <ErrorSecondaryText>{errorMessage}</ErrorSecondaryText>}
                    <TableSurface>
                        <ServerPaginatedTable<ClientsTableRow, DbClientRow>
                            dataPortion={clientsDataPortion}
                            paginationConfig={{
                                enablePagination: true,
                                filteredCount: filteredClientCount,
                                onPageChange: setCurrentPage,
                                onPerPageChange: setPerPage,
                            }}
                            sortConfig={{
                                sortPossible: true,
                                sortableColumns: clientsSortableColumns,
                                setSortState: setSortState,
                            }}
                            headerKeysAndLabels={clientsHeaders}
                            onRowClick={(row) => {
                                router.push(`/clients?${clientIdParam}=${row.data.clientId}`);
                            }}
                            filterConfig={{
                                primaryFiltersShown: true,
                                primaryFilters: primaryFilters,
                                setPrimaryFilters: setPrimaryFilters,
                                additionalFiltersShown: false,
                            }}
                            checkboxConfig={{ displayed: false }}
                            editableConfig={{ editable: false }}
                            isLoading={isLoading}
                            pointerOnHover={true}
                            columnDisplayFunctions={{ addressPostcode: formatNullPostcode }}
                        />
                    </TableSurface>
                    <Centerer>
                        <LinkButton link="/clients/add">Add Client</LinkButton>
                    </Centerer>

                    <Modal
                        header={
                            <>
                                <Icon icon={faUser} color={theme.primary.largeForeground[2]} />
                                Client Details
                            </>
                        }
                        isOpen={clientId !== null}
                        onClose={() => {
                            router.push("/clients");
                        }}
                        headerId="clientsDetailModal"
                        footer={
                            isSelectedClientActive && (
                                <Centerer>
                                    <LinkButton link={`/clients/edit/${clientId}`}>
                                        Edit Client
                                    </LinkButton>
                                    <LinkButton link={`/parcels/add/${clientId}`}>
                                        Add Parcel
                                    </LinkButton>
                                    <DeleteButton onClick={() => setIsDeleteClientDialogOpen(true)}>
                                        Delete Client
                                    </DeleteButton>
                                </Centerer>
                            )
                        }
                    >
                        <OutsideDiv>
                            <ContentDiv>
                                {clientId && (
                                    <Suspense fallback={<ExpandedClientDetailsFallback />}>
                                        <ExpandedClientDetails clientId={clientId} />
                                    </Suspense>
                                )}
                            </ContentDiv>

                            <ButtonsDiv>
                                {isClientActiveErrorMessage && (
                                    <ErrorSecondaryText>
                                        {isClientActiveErrorMessage}
                                    </ErrorSecondaryText>
                                )}
                                {deleteClientErrorMessage && (
                                    <ErrorSecondaryText>
                                        {deleteClientErrorMessage}
                                    </ErrorSecondaryText>
                                )}
                            </ButtonsDiv>
                        </OutsideDiv>
                    </Modal>
                    <ConfirmDialog
                        isOpen={isDeleteClientDialogOpen}
                        message="Are you sure you want to delete this client? This action cannot be undone."
                        onCancel={() => setIsDeleteClientDialogOpen(false)}
                        onConfirm={onDeleteClient}
                    />
                </>
            )}
        </>
    );
};

export default ClientsPage;
