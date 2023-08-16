"use client";

import React, { ReactElement } from "react";
import UsersTable from "@/app/admin/UsersTable";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import TableSurface from "@/components/Tables/TableSurface";
import CreateUserForm from "@/app/admin/CreateUserForm";
import { faUsers, faUserPlus, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const PanelIcon = styled(FontAwesomeIcon)`
    margin-right: 0.5em;
`;

interface Props {
    userData: any; // TODO DEFINE TYPE
}

const AdminPage: React.FC<Props> = (props) => {
    const adminPanels: [string, IconDefinition, ReactElement][] = [
        ["USERS TABLE", faUsers, <UsersTable key={1} userData={props.userData} />], // TODO PASS DATA
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
