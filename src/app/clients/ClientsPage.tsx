"use client";

import LinkButton from "@/components/Buttons/LinkButton";
import Icon from "@/components/Icons/Icon";
import Modal from "@/components/Modal/Modal";
import { ButtonsDiv, Centerer, ContentDiv, OutsideDiv } from "@/components/Modal/ModalFormStyles";
import Table, { SortOptions, TableHeaders, SortState } from "@/components/Tables/Table";
import TableSurface from "@/components/Tables/TableSurface";
import supabase from "@/supabaseClient";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState, Suspense, useRef, useCallback } from "react";
import { useTheme } from "styled-components";
import getClientsDataAndCount from "./getClientsData";
import { useSearchParams, useRouter } from "next/navigation";
import ExpandedClientDetails from "@/app/clients/ExpandedClientDetails";
import ExpandedClientDetailsFallback from "@/app/clients/ExpandedClientDetailsFallback";
import { buildTextFilter } from "@/components/Tables/TextFilter";
import { Filter, PaginationType } from "@/components/Tables/Filters";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import { Database } from "@/databaseTypesFile";
import { CircularProgress } from "@mui/material";
import { ErrorSecondaryText } from "../errorStylingandMessages";
import { subscriptionStatusRequiresErrorMessage } from "@/common/subscriptionStatusRequiresErrorMessage";
import { nullPostcodeDisplay } from "@/common/format";

export interface ClientsTableRow {
    clientId: string;
    fullName: string;
    familyCategory: string;
    addressPostcode: string | null;
}

const headers: TableHeaders<ClientsTableRow> = [
    ["fullName", "Name"],
    ["familyCategory", "Family"],
    ["addressPostcode", "Postcode"],
];

const fullNameSearch = (
    query: PostgrestFilterBuilder<Database["public"], any, any>,
    state: string
): PostgrestFilterBuilder<Database["public"], any, any> => {
    return query.ilike("full_name", `%${state}%`);
};

const filters: Filter<ClientsTableRow, any>[] = [
    buildTextFilter({
        key: "fullName",
        label: "Name",
        headers: headers,
        methodConfig: { paginationType: PaginationType.Server, method: fullNameSearch },
    }),
];

const sortableColumns: SortOptions<ClientsTableRow>[] = [
    {
        key: "fullName",
        sortMethodConfig: {
            method: (query, sortDirection) =>
                query.order("full_name", { ascending: sortDirection === "asc" }),
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
                query.order("address_postcode", { ascending: sortDirection === "asc" }),
            paginationType: PaginationType.Server,
        },
    },
];

const clientIdParam = "clientId";
const ClientsPage: React.FC<{}> = () => {
    const [isLoadingForFirstTime, setIsLoadingForFirstTime] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [clientsDataPortion, setClientsDataPortion] = useState<ClientsTableRow[]>([]);
    const [filteredClientCount, setFilteredClientCount] = useState<number>(0);
    const [sortState, setSortState] = useState<SortState<ClientsTableRow>>({ sortEnabled: false });
    const [primaryFilters, setPrimaryFilters] = useState<Filter<ClientsTableRow, any>[]>(filters);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const clientTableFetchAbortController = useRef<AbortController | null>(null);

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
        void fetchAndDisplayClientsData();
        // This requires that the DB clients, collection_centres, and families tables have Realtime turned on
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
            supabase.removeChannel(subscriptionChannel);
        };
    }, [startPoint, endPoint, primaryFilters, sortState]);
    const theme = useTheme();
    const router = useRouter();

    const searchParams = useSearchParams();
    const clientId = searchParams.get(clientIdParam);

    const formatNullPostcode = (postcodeData: ClientsTableRow["addressPostcode"]): string => {
        return postcodeData ?? nullPostcodeDisplay;
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
                        <Table
                            dataPortion={clientsDataPortion}
                            paginationConfig={{
                                enablePagination: true,
                                filteredCount: filteredClientCount,
                                onPageChange: setCurrentPage,
                                onPerPageChange: setPerPage,
                            }}
                            sortConfig={{
                                sortPossible: true,
                                sortableColumns: sortableColumns,
                                setSortState: setSortState,
                            }}
                            headerKeysAndLabels={headers}
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
                                <Centerer>
                                    <LinkButton link={`/clients/edit/${clientId}`}>
                                        Edit Client
                                    </LinkButton>
                                    <LinkButton link={`/parcels/add/${clientId}`}>
                                        Add Parcel
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

export default ClientsPage;
