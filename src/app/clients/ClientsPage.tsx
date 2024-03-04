"use client";

import getExpandedClientDetails, {
    ExpandedClientDetails,
} from "@/app/clients/getExpandedClientDetails";
import LinkButton from "@/components/Buttons/LinkButton";
import DataViewer from "@/components/DataViewer/DataViewer";
import Icon from "@/components/Icons/Icon";
import Modal from "@/components/Modal/Modal";
import { ButtonsDiv, Centerer, ContentDiv, OutsideDiv } from "@/components/Modal/ModalFormStyles";
import Table, { TableHeaders } from "@/components/Tables/Table";
import TableSurface from "@/components/Tables/TableSurface";
import supabase from "@/supabaseClient";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import { useTheme } from "styled-components";
import getClientsData, { getClientsCount } from "./getClientsData";

export interface ClientsTableRow {
    primaryKey: string;
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
    const [count, setCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [tableData, setTableData] = useState<ClientsTableRow[]>([]);
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const [activeData, setActiveData] = useState<ExpandedClientDetails | null>(null);
    const theme = useTheme();

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

    // useEffect(() => {
    //     // This requires that the DB clients and families tables have Realtime turned on
    //     const subscriptionChannel = supabase
    //         .channel("parcels-table-changes")
    //         .on("postgres_changes", { event: "*", schema: "public", table: "clients" }, async () =>
    //             {setCount(await getClientsCount(supabase));
    //             setTableData(await getClientsData(supabase));}
    //         )
    //         .on("postgres_changes", { event: "*", schema: "public", table: "families" }, async () =>
    //             {setCount(await getClientsCount(supabase));
    //             setTableData(await getClientsData(supabase));}
    //         )
    //         .subscribe();

    //     return () => {
    //         supabase.removeChannel(subscriptionChannel);
    //     };
    // }, []);

    return (
        <>
                <>
                    <TableSurface>
                        <Table
                            data={tableData}
                            headerKeysAndLabels={headers}
                            onRowClick={(row) =>
                                getExpandedClientDetails(row.data.primaryKey).then((data) => {
                                    setModalIsOpen(true);
                                    setActiveData(data);
                                })
                            }
                            sortable={["fullName", "familyCategory", "addressPostcode"]}
                            pagination
                            checkboxes={false}
                            filters={["fullName"]}
                            loading={isLoading}
                            setLoading={setIsLoading}
                            getData={getClientsData}
                            getCount={getClientsCount}
                            supabase={supabase}
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
                        isOpen={modalIsOpen}
                        onClose={() => setModalIsOpen(false)}
                        headerId="clientsDetailModal"
                    >
                        <OutsideDiv>
                            <ContentDiv>
                                <DataViewer data={activeData ?? {}} />
                            </ContentDiv>

                            <ButtonsDiv>
                                <Centerer>
                                    <LinkButton link={`/clients/edit/${activeData?.primaryKey}`}>
                                        Edit Client
                                    </LinkButton>
                                    <LinkButton link={`/parcels/add/${activeData?.primaryKey}`}>
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
