"use client";

import LinkButton from "@/components/Buttons/LinkButton";
import Icon from "@/components/Icons/Icon";
import Modal from "@/components/Modal/Modal";
import { ButtonsDiv, Centerer, ContentDiv, OutsideDiv } from "@/components/Modal/ModalFormStyles";
import Table, { TableHeaders } from "@/components/Tables/Table";
import TableSurface from "@/components/Tables/TableSurface";
import supabase from "@/supabaseClient";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState, Suspense } from "react";
import { useTheme } from "styled-components";
import getClientsData, { getClientsCount } from "./getClientsData";
import { useSearchParams, useRouter } from "next/navigation";
import ExpandedClientDetails from "@/app/clients/ExpandedClientDetails";
import ExpandedClientDetailsFallback from "@/app/clients/ExpandedClientDetailsFallback";

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

const clientIdParam = "clientId";
const ClientsPage: React.FC<{}> = () => {
    const [count, setCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [clientsTableData, setClientsTableData] = useState<ClientsTableRow[]>([]);
    const theme = useTheme();
    const router = useRouter();

    const searchParams = useSearchParams();
    const clientId = searchParams.get(clientIdParam);

    useEffect(() => {
        (async () => {
            setCount(await getClientsCount(supabase))})();
    }, []);

    // useEffect(() => {
    //     let staleFetch = false;

    //     (async () => {
    //         setIsLoading(true);
    //         const fetchedData = await getClientsData(supabase);
    //         if (!staleFetch) {
    //             setTableData(fetchedData);
    //         }
    //         setIsLoading(false);
    //     })();

    //     return () => {
    //         staleFetch = true;
    //     };
    // }, []);

    return (
        <>
                <>
                    <TableSurface>
                        <Table
                            data={clientsTableData}
                            headerKeysAndLabels={headers}
                            onRowClick={(row) => {
                                router.push(`/clients?${clientIdParam}=${row.data.clientId}`);
                            }}
                            sortable={["fullName", "familyCategory", "addressPostcode"]}
                            pagination
                            checkboxes={false}
                            filters={["fullName"]}
                            loading={isLoading}
                            setLoading={setIsLoading}
                            getData={getClientsData}
                            getCount={getClientsCount}
                            supabase={supabase}
                            subscriptions={[{ event: "*", schema: "public", table: "clients" }, { event: "*", schema: "public", table: "families" }]}
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
