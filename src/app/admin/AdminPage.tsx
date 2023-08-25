"use client";

import React, { ReactElement } from "react";
import UsersTable from "@/app/admin/usersTable/UsersTable";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import TableSurface from "@/components/Tables/TableSurface";
import CreateUserForm from "@/app/admin/createUser/CreateUserForm";
import { faUsers, faUserPlus, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UserRow } from "@/app/admin/page";

const PanelIcon = styled(FontAwesomeIcon)`
    margin-right: 0.5em;
`;

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
}

const AdminPage: React.FC<Props> = (props) => {
    const adminPanels: Panel[] = [
        {
            panelTitle: "Users Table",
            panelIcon: faUsers,
            panelContent: <UsersTable userData={props.userData} />,
        },
        { panelTitle: "Create User", panelIcon: faUserPlus, panelContent: <CreateUserForm /> },
    ];

    return (
        <>
            {adminPanels.map(({ panelTitle, panelIcon, panelContent }, index) => {
                return (
                    <TableSurface key={index}>
                        <Accordion elevation={0}>
                            <AccordionSummary expandIcon={<ExpandMore />}>
                                <PanelIcon size="2x" icon={panelIcon} />
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
