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
import { UserRow } from "@/app/admin/adminActions";

const PanelIcon = styled(FontAwesomeIcon)`
    margin-right: 0.5em;
`;

interface Props {
    userData: UserRow[];
}

// TODO VFB-23 Add accessibility tests for the admin page

const AdminPage: React.FC<Props> = (props) => {
    const adminPanels: [string, IconDefinition, ReactElement][] = [
        ["USERS TABLE", faUsers, <UsersTable key={1} userData={props.userData} />],
        ["CREATE USER", faUserPlus, <CreateUserForm key={2} />],
    ];

    return (
        <>
            {adminPanels.map(([panelTitle, panelIcon, PanelContent], index) => {
                return (
                    <TableSurface key={index}>
                        <Accordion elevation={0}>
                            <AccordionSummary expandIcon={<ExpandMore />}>
                                <PanelIcon size="2x" icon={panelIcon} />
                                <h2>{panelTitle}</h2>
                            </AccordionSummary>
                            <AccordionDetails>{PanelContent}</AccordionDetails>
                        </Accordion>
                    </TableSurface>
                );
            })}
        </>
    );
};

export default AdminPage;
