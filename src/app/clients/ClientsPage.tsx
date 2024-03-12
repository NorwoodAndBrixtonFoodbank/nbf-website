"use client";

import LinkButton from "@/components/Buttons/LinkButton";
import Icon from "@/components/Icons/Icon";
import Modal from "@/components/Modal/Modal";
import { ButtonsDiv, Centerer, ContentDiv, OutsideDiv } from "@/components/Modal/ModalFormStyles";
import Table, { SortOptions, TableHeaders, SortState } from "@/components/Tables/Table";
import TableSurface from "@/components/Tables/TableSurface";
import supabase from "@/supabaseClient";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState, Suspense } from "react";
import { useTheme } from "styled-components";
import getClientsData, { getClientsCount } from "./getClientsData";
import { useSearchParams, useRouter } from "next/navigation";
import ExpandedClientDetails from "@/app/clients/ExpandedClientDetails";
import ExpandedClientDetailsFallback from "@/app/clients/ExpandedClientDetailsFallback";
import { buildTextFilter } from "@/components/Tables/TextFilter";
import { Filter } from "@/components/Tables/Filters";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import { Database } from "@/databaseTypesFile";

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
    buildTextFilter({ key: "fullName", label: "Name", headers: headers, methodConfig: {methodType: "query", method: fullNameSearch }}),
];

const sortableColumns: SortOptions<ClientsTableRow, any>[] = [
    {
        key: "fullName",
        sortMethod: (query, sortDirection) =>
            query.order("full_name", { ascending: sortDirection === "asc" }),
    },
    //{key: "familyCategory", sortMethod: (query, sortDirection) => query.order("full_name", {ascending: sortDirection === "asc"})},broke
    {
        key: "addressPostcode",
        sortMethod: (query, sortDirection) =>
            query.order("address_postcode", { ascending: sortDirection === "asc" }),
    },
];

const clientIdParam = "clientId";
const ClientsPage: React.FC<{}> = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [clientsDataPortion, setClientsDataPortion] = useState<ClientsTableRow[]>([]);
    const [totalRows, setTotalRows] = useState<number>(0);
    const [sortState, setSortState] = useState<SortState<ClientsTableRow>>({ sort: false });
    const [primaryFilters, setPrimaryFilters] = useState<Filter<ClientsTableRow, any>[]>(filters);

    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const startPoint = (currentPage - 1) * perPage;
    const endPoint = currentPage * perPage - 1;

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            setTotalRows(await getClientsCount(supabase, primaryFilters));
            const fetchedData = await getClientsData(
                supabase,
                startPoint,
                endPoint,
                primaryFilters,
                sortState
            );
            setClientsDataPortion(fetchedData);
            setIsLoading(false);
        })();
    }, [startPoint, endPoint, sortState, primaryFilters]);

    //remember to deal with what happens if filters change twice and requests come back out of order. deal with in useeffect that sets data inside Table
    useEffect(() => {
        const loadCountAndData = async (): Promise<void> => {
            setIsLoading(true);
            setTotalRows(await getClientsCount(supabase, primaryFilters));
            const fetchedData = await getClientsData(
                supabase,
                startPoint,
                endPoint,
                primaryFilters,
                sortState
            );
            setClientsDataPortion(fetchedData);
            setIsLoading(false);
        };
        // This requires that the DB parcels table has Realtime turned on
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
            <>
                <TableSurface>
                    <Table
                        dataPortion={clientsDataPortion}
                        paginationConfig={{
                            pagination: true,
                            totalRows: totalRows,
                        onPageChange: setCurrentPage,
                        onPerPageChange: setPerPage
                        }}
                        sortConfig={{
                            sortShown: true,
                            sortableColumns: sortableColumns,
                            setSortState: setSortState
                        }}
                        headerKeysAndLabels={headers}
                        onRowClick={(row) => {
                            router.push(`/clients?${clientIdParam}=${row.data.clientId}`);
                        }}
                        filterConfig={{
                            primaryFiltersShown: true,
                            primaryFilters: primaryFilters,
                            setPrimaryFilters: setPrimaryFilters,
                            additionalFiltersShown: false
                        }}
                        checkboxConfig={{ displayed: false }}
                        editableConfig={{editable: false}}
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
        </>
    );
};

export default ClientsPage;
