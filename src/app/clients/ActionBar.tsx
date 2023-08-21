"use client";

import supabase from "@/supabaseClient";
import React, { useState } from "react";
import ActionBarModal from "@/app/clients/ActionBarModal";
import styled from "styled-components";
import Button from "@mui/material/Button/Button";
import Menu from "@mui/material/Menu/Menu";
import MenuList from "@mui/material/MenuList/MenuList";
import MenuItem from "@mui/material/MenuItem/MenuItem";
import { Dayjs } from "dayjs";
import { ClientsTableRow } from "@/app/clients/getClientsTableData";
import Paper from "@mui/material/Paper/Paper";

interface Props {
    selected: number[];
    data: ClientsTableRow[];
}

const statuses = [
    "Request Denied",
    "No Status",
    "Pending More Info",
    "Called and Confirmed",
    "Called and No Response",
    "Ready to Dispatch",
    "Received by Centre",
    "Collection Failed",
    "Parcel Collected",
    "Delivered",
    "Delivery Failed",
    "Delivery Cancelled",
    "Fulfilled with Trussell Trust",
];

const actions = [
    "Generate Map",
    "Print Day Overview",
    "Print Shopping List",
    "Print Shipping Label",
    "Print Driver Overview",
    "Delete Request",
];

const OuterDiv = styled.div`
    display: flex;
    padding: 1rem;
    gap: 1rem;
    border-radius: 0.5rem;
    background-color: ${(props) => props.theme.surfaceBackgroundColor};
    margin: 1rem;
`;

const StyledPaper = styled(Paper)`
    margin: 1rem;
`;

const ActionBar: React.FC<Props> = ({ selected, data }) => {
    const selectedData = Array.from(selected.map((index) => data[index]));

    const [statusAnchorElement, setStatusAnchorElement] = useState<null | HTMLElement>(null);
    const [actionAnchorElement, setActionAnchorElement] = useState<null | HTMLElement>(null);
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
    const [selectedAction, setSelectedAction] = useState<string | null>(null);

    const [statusModal, setStatusModal] = useState(false);
    const [actionModal, setActionModal] = useState(false);

    const [modalError, setModalError] = useState<string | null>(null);

    const submitStatus = async (date: Dayjs): Promise<void> => {
        const toInsert = selectedData
            .map((parcel: ClientsTableRow) => {
                const event_name = selectedStatus!;
                const timestamp = date.set("second", 0).toISOString();
                return {
                    event_name,
                    parcel_id: parcel.parcelId,
                    timestamp,
                };
            })
            .flat();

        const { error } = await supabase.from("events").insert(toInsert);

        if (error) {
            setModalError(error.message);
        } else {
            setStatusModal(false);
            setModalError(null);
        }
    };

    const submitAction = async (): Promise<void> => {
        // TODO VFB-10,11,12 implement whatever actions are meant to do
    };

    return (
        <StyledPaper>
            <ActionBarModal
                isOpen={statusModal}
                onClose={() => {
                    setStatusModal(false);
                    setModalError(null);
                }}
                data={selectedData}
                status={selectedStatus}
                header={selectedStatus ?? "Apply Status"}
                headerId="status-modal-header"
                onSubmit={submitStatus}
                errorText={modalError}
            />
            <ActionBarModal
                isOpen={actionModal}
                onClose={() => {
                    setActionModal(false);
                    setModalError(null);
                }}
                data={selectedData}
                status={selectedAction}
                header={selectedAction ?? "Apply Action"}
                headerId="action-modal-header"
                onSubmit={submitAction}
                errorText={modalError}
            />
            <Menu
                open={statusAnchorElement !== null}
                onClose={() => setStatusAnchorElement(null)}
                anchorEl={statusAnchorElement}
            >
                <MenuList id="status-menu">
                    {statuses.map((status, index) => {
                        return (
                            <MenuItem
                                key={index}
                                onClick={() => {
                                    setSelectedStatus(status);
                                    setStatusModal(true);
                                    setStatusAnchorElement(null);
                                }}
                            >
                                {status}
                            </MenuItem>
                        );
                    })}
                </MenuList>
            </Menu>
            <Menu
                open={actionAnchorElement !== null}
                onClose={() => setActionAnchorElement(null)}
                anchorEl={actionAnchorElement}
            >
                <MenuList id="action-menu">
                    {actions.map((action, index) => {
                        return (
                            <MenuItem
                                key={index}
                                onClick={() => {
                                    setSelectedAction(action);
                                    setActionModal(true);
                                    setActionAnchorElement(null);
                                }}
                            >
                                {action}
                            </MenuItem>
                        );
                    })}
                </MenuList>
            </Menu>
            <OuterDiv>
                <Button
                    variant="contained"
                    onClick={(event) => setStatusAnchorElement(event.currentTarget)}
                    type="button"
                    id="status-button"
                >
                    Statuses
                </Button>
                <Button
                    variant="contained"
                    onClick={(event) => setActionAnchorElement(event.currentTarget)}
                    type="button"
                    id="action-button"
                >
                    Actions
                </Button>
            </OuterDiv>
        </StyledPaper>
    );
};

export default ActionBar;
