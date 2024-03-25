"use client";

import LinkButton from "@/components/Buttons/LinkButton";
import Icon from "@/components/Icons/Icon";
import Modal from "@/components/Modal/Modal";
import { ButtonsDiv, Centerer, ContentDiv, OutsideDiv } from "@/components/Modal/ModalFormStyles";
import Table, { SortOptions, TableHeaders, SortState } from "@/components/Tables/Table";
import TableSurface from "@/components/Tables/TableSurface";
import supabase from "@/supabaseClient";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState, Suspense, useRef } from "react";
import { useTheme } from "styled-components";
import getClientsData, { getClientsCount } from "./getClientsData";
import { useSearchParams, useRouter } from "next/navigation";
import ExpandedClientDetails from "@/app/clients/ExpandedClientDetails";
import ExpandedClientDetailsFallback from "@/app/clients/ExpandedClientDetailsFallback";
import { buildTextFilter } from "@/components/Tables/TextFilter";
import { Filter, PaginationType } from "@/components/Tables/Filters";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import { Database } from "@/databaseTypesFile";
import { CircularProgress } from "@mui/material";

export interface ClientsTableRow {
    clientId: string;
    fullName: string;
    familyCategory: string;
    addressPostcode: string;
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
    const abortController = useRef<AbortController>();

    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const startPoint = (currentPage - 1) * perPage;
    const endPoint = currentPage * perPage - 1;

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            if (abortController.current) {
                abortController.current.abort("stale request");
            }
            abortController.current = new AbortController();
            if (abortController.current) {
                const filteredClientCount = await getClientsCount(
                    supabase,
                    primaryFilters,
                    abortController.current.signal
                );
                const fetchedData = await getClientsData(
                    supabase,
                    startPoint,
                    endPoint,
                    primaryFilters,
                    sortState,
                    abortController.current.signal
                );
                abortController.current = undefined;
                !filteredClientCount.abortSignalResponse.aborted &&
                    setFilteredClientCount(filteredClientCount.count);
                !fetchedData.abortSignalResponse.aborted && setClientsDataPortion(fetchedData.data);
            }
            setIsLoading(false);
            setIsLoadingForFirstTime(false);
        })();
    }, [startPoint, endPoint, primaryFilters, sortState]);

    useEffect(() => {
        const loadCountAndData = async (): Promise<void> => {
            setIsLoading(true);
            if (abortController.current) {
                abortController.current.abort("stale request");
            }
            abortController.current = new AbortController();
            if (abortController.current) {
                const filteredParcelCount = await getClientsCount(
                    supabase,
                    primaryFilters,
                    abortController.current.signal
                );
                const fetchedData = await getClientsData(
                    supabase,
                    startPoint,
                    endPoint,
                    primaryFilters,
                    sortState,
                    abortController.current.signal
                );
                abortController.current = undefined;
                !filteredParcelCount.abortSignalResponse.aborted &&
                    setFilteredClientCount(filteredParcelCount.count);
                !fetchedData.abortSignalResponse.aborted && setClientsDataPortion(fetchedData.data);
            }
            setIsLoading(false);
            setIsLoadingForFirstTime(false);
        };
        // This requires that the DB clients, collection_centres, and families tables have Realtime turned on
        const subscriptionChannel = supabase
            .channel("parcels-table-changes")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "clients" },
                loadCountAndData
            )
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "collection_centres" },
                loadCountAndData
            )
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "families" },
                loadCountAndData
            )
            .subscribe();

        return () => {
            supabase.removeChannel(subscriptionChannel);
        };
    }, [startPoint, endPoint, primaryFilters, sortState]);
    const theme = useTheme();
    const router = useRouter();

    const searchParams = useSearchParams();
    const clientId = searchParams.get(clientIdParam);

    return (
        <>
            {isLoadingForFirstTime ? (
                <Centerer>
                    <CircularProgress aria-label="table-initial-progress-bar" />
                </Centerer>
            ) : (
                <>
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
