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
import getClientsData from "./getClientsData";
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

const ClientsPage: React.FC<{}> = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [clientsTableData, setClientsTableData] = useState<ClientsTableRow[]>([]);
    const theme = useTheme();
    const router = useRouter();

    const searchParams = useSearchParams();
    const clientId = searchParams.get("clientId");

    useEffect(() => {
        let staleFetch = false;

        (async () => {
            setIsLoading(true);
            const fetchedData = await getClientsData(supabase);
            if (!staleFetch) {
                setClientsTableData(fetchedData);
            }
            setIsLoading(false);
        })();

        return () => {
            staleFetch = true;
        };
    }, []);

    useEffect(() => {
        // This requires that the DB clients and families tables have Realtime turned on
        const subscriptionChannel = supabase
            .channel("parcels-table-changes")
            .on("postgres_changes", { event: "*", schema: "public", table: "clients" }, async () =>
                setClientsTableData(await getClientsData(supabase))
            )
            .on("postgres_changes", { event: "*", schema: "public", table: "families" }, async () =>
                setClientsTableData(await getClientsData(supabase))
            )
            .subscribe();

        return () => {
            supabase.removeChannel(subscriptionChannel);
        };
    }, []);

    return (
        <>
            {isLoading ? (
                <></>
            ) : (
                <>
                    <TableSurface>
                        <Table
                            data={clientsTableData}
                            headerKeysAndLabels={headers}
                            onRowClick={(row) => {
                                router.push(`/clients/?clientId=${row.data.clientId}`);
                            }}
                            sortable={["fullName", "familyCategory", "addressPostcode"]}
                            pagination
                            checkboxes={false}
                            filters={["fullName"]}
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
                            router.push("clients/");
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
