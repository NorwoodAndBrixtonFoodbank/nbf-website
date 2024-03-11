"use client";

import LinkButton from "@/components/Buttons/LinkButton";
import Icon from "@/components/Icons/Icon";
import Modal from "@/components/Modal/Modal";
import { ButtonsDiv, Centerer, ContentDiv, OutsideDiv } from "@/components/Modal/ModalFormStyles";
import Table, { SortOptions, ActiveSortState, TableHeaders, SortState } from "@/components/Tables/Table";
import TableSurface from "@/components/Tables/TableSurface";
import supabase from "@/supabaseClient";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState, Suspense } from "react";
import { useTheme } from "styled-components";
import getClientsData, { getClientsCount } from "./getClientsData";
import { useSearchParams, useRouter } from "next/navigation";
import ExpandedClientDetails from "@/app/clients/ExpandedClientDetails";
import ExpandedClientDetailsFallback from "@/app/clients/ExpandedClientDetailsFallback";
import { textFilter } from "@/components/Tables/TextFilter";
import { Filter } from "@/components/Tables/Filters";
import { fullName } from "@snaplet/copycat/dist/fullName";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import { Database } from "@/databaseTypesFile";
import { RealtimePostgresChangesFilter } from "@supabase/supabase-js";
import { SortOrder } from "react-data-table-component";

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

const fullNameSearch = (query: PostgrestFilterBuilder<Database["public"], any, any>, state: string): PostgrestFilterBuilder<Database["public"], any, any> => {
    return query.ilike('full_name', `%${state}%`);
}

const filters: Filter<ClientsTableRow, any>[] = [
    textFilter({key: "fullName", label: "Name", headers: headers, filterMethod: fullNameSearch})
]

const subscriptions: RealtimePostgresChangesFilter<"*">[] = [{ event: "*", schema: "public", table: "clients" }, { event: "*", schema: "public", table: "families" }]

const sortableColumns: SortOptions<ClientsTableRow, any>[] = [
    {key: "fullName", sortMethod: (query, sortDirection) => query.order("full_name", {ascending: sortDirection === "asc"})},
    //{key: "familyCategory", sortMethod: (query, sortDirection) => query.order("full_name", {ascending: sortDirection === "asc"})},broke
    {key: "addressPostcode", sortMethod: (query, sortDirection) => query.order("address_postcode", {ascending: sortDirection === "asc"})}
]

const clientIdParam = "clientId";
const ClientsPage: React.FC<{}> = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [clientsDataPortion, setClientsDataPortion] = useState<ClientsTableRow[]>([]);
    const [totalRows, setTotalRows] = useState<number>(0);
    const [sortState, setSortState] = useState<SortState<ClientsTableRow>>({sort: false});
    const [primaryFilters, setPrimaryFilters] = useState<Filter<ClientsTableRow, any>[]>(filters);

    const getStartPoint = (currentPage: number, perPage: number): number => ((currentPage - 1) * perPage);
    const getEndPoint = (currentPage: number, perPage: number): number => ((currentPage) * perPage - 1);

    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const allFilterStates = primaryFilters.map((filter)=>filter.state)

    const fetchCount = async () => {
        setTotalRows(await getClientsCount(supabase, filters));
    };

    const fetchData = async () => {
        const fetchedData = await getClientsData(supabase, getStartPoint(currentPage, perPage), getEndPoint(currentPage, perPage), filters, sortState);
        console.log(fetchedData);
        setClientsDataPortion(fetchedData);
    }

    useEffect(() => {
        (async () => {        
            setIsLoading(true);
            await fetchCount();
            await fetchData();
            setIsLoading(false);})();
    }, [currentPage, perPage, sortState, ...allFilterStates]);
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
                        setDataPortion={setClientsDataPortion}
                        totalRows={totalRows}
                        onPageChange={setCurrentPage}
                        onPerPageChage={setPerPage}
                            headerKeysAndLabels={headers}
                            onRowClick={(row) => {
                                router.push(`/clients?${clientIdParam}=${row.data.clientId}`);
                            }}
                            sortableColumns={sortableColumns}
                            pagination
                            checkboxes={false}
                            primaryFilters={primaryFilters}
                            setPrimaryFilters={setPrimaryFilters}
                            onSort={setSortState}
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
