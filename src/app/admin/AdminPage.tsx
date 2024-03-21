"use client";

import { NoSSR } from "next/dist/shared/lib/lazy-dynamic/dynamic-no-ssr";
import React, { ReactElement } from "react";
import UsersTable from "@/app/admin/usersTable/UsersTable";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import TableSurface from "@/components/Tables/TableSurface";
import CreateUserForm from "@/app/admin/createUser/CreateUserForm";
import {
    faUsers,
    faUserPlus,
    faCity,
    faBuildingCircleArrowRight,
    faBoxOpen,
    IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UserRow } from "@/app/admin/page";
import CollectionCentresTable from "@/app/admin/collectionCentresTable/CollectionCentresTable";
import { Schema } from "@/databaseUtils";
import CreateCollectionCentreForm from "@/app/admin/createCollectionCentre/CreateCollectionCentreForm";
import PackingSlotsTable from "@/app/admin/packingSlotsTable/PackingSlotsTable";

const PanelTitle = styled.h2`
    text-transform: uppercase;
`;

interface Panel {
    panelTitle: string;
    panelIcon: IconDefinition;
    panelContent: ReactElement;
}

interface Props {
    userData: UserRow[];
    collectionCentreData: Schema["collection_centres"][];
}

const PanelIcon = styled(FontAwesomeIcon)`
    padding-right: 0.9rem;
`;

const AdminPage: React.FC<Props> = (props) => {
    const adminPanels: Panel[] = [
        {
            panelTitle: "Users Table",
            panelIcon: faUsers,
            panelContent: <UsersTable userData={props.userData} />,
        },
        { panelTitle: "Create User", panelIcon: faUserPlus, panelContent: <CreateUserForm /> },
        {
            panelTitle: "Collection Centres Table",
            panelIcon: faCity,
            panelContent: (
                <CollectionCentresTable collectionCentreData={props.collectionCentreData} />
            ),
        },
        {
            panelTitle: "Create Collection Centre",
            panelIcon: faBuildingCircleArrowRight,
            panelContent: <CreateCollectionCentreForm />,
        },
        {
            panelTitle: "Modify Packing Slots",
            panelIcon: faBoxOpen,
            panelContent: <PackingSlotsTable />,
        },
    ];

    return (
        <>
            {adminPanels.map(({ panelTitle, panelIcon, panelContent }) => {
                return (
                    <TableSurface key={panelTitle}>
                        <Accordion elevation={0}>
                            <AccordionSummary expandIcon={<ExpandMore />}>
                                <NoSSR>
                                    <PanelIcon size="2x" icon={panelIcon} />
                                </NoSSR>
                                <PanelTitle>{panelTitle}</PanelTitle>
                            </AccordionSummary>
                            <AccordionDetails>{panelContent}</AccordionDetails>
                        </Accordion>
                    </TableSurface>
                );
            })}
        </>
    );
};

export default AdminPage;
