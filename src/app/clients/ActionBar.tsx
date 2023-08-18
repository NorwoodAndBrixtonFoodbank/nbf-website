"use client";

import supabase from "@/supabaseClient";
import React, { useState } from "react";
import ShippingLabelsModal from "@/app/clients/actionBarModal/ShippingLabelsModal";
import styled from "styled-components";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu/Menu";
import MenuList from "@mui/material/MenuList/MenuList";
import MenuItem from "@mui/material/MenuItem/MenuItem";
import { Dayjs } from "dayjs";
import { ClientsTableRow } from "@/app/clients/getClientsTableData";
import Paper from "@mui/material/Paper/Paper";
import Alert from "@mui/material/Alert";
import ShoppingListModal from "@/app/clients/actionBarModal/ShoppingListModal";
import ActionBarModal from "@/app/clients/ActionBarModal";

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

const OuterDiv = styled.div`
    display: flex;
    padding: 1rem;
    gap: 0.5rem;
    border-radius: 0.5rem;
    background-color: ${(props) => props.theme.surfaceBackgroundColor};
`;

const AlertBox = styled.div`
    padding: 0 1rem 1rem;
    gap: 0.5rem;
    border-radius: 0.5rem;
`;

const StyledPaper = styled(Paper)`
    margin: 1rem;
`;

const ActionBar: React.FC<Props> = ({ selected, data }) => {
    const selectedData = Array.from(selected.map((index) => data[index]));

    const [statusAnchorElement, setStatusAnchorElement] = useState<HTMLElement | null>(null);
    const [actionAnchorElement, setActionAnchorElement] = useState<HTMLElement | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
    const [selectedAction, setSelectedAction] = useState<string | null>(null);

    const [statusModal, setStatusModal] = useState(false);
    const [shippingLabelsModal, setShippingLabelsModal] = useState(false);
    const [shoppingListModal, setShoppingListModal] = useState(false);

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
            window.location.reload();
        }
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
                header={selectedStatus ?? "Apply Status"}
                headerId="status-modal-header"
                onSubmit={submitStatus}
                errorText={modalError}
            />
            {shippingLabelsModal ? (
                <ShippingLabelsModal
                    isOpen={shippingLabelsModal}
                    onClose={() => {
                        setShippingLabelsModal(false);
                        setModalError(null);
                    }}
                    data={selectedData}
                    status={selectedAction}
                    header="Print Shipping Labels"
                    headerId="action-modal-header"
                    errorText={modalError}
                />
            ) : (
                <></>
            )}
            {shoppingListModal ? (
                <ShoppingListModal
                    isOpen={shoppingListModal}
                    onClose={() => {
                        setShoppingListModal(false);
                        setModalError(null);
                    }}
                    data={selectedData[0]}
                    status={selectedAction}
                    header="Print Shopping List"
                    headerId="action-modal-header"
                    errorText={modalError}
                />
            ) : (
                <></>
            )}
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
            {actionAnchorElement ? (
                <Menu
                    open={actionAnchorElement !== null}
                    onClose={() => setActionAnchorElement(null)}
                    anchorEl={actionAnchorElement}
                >
                    <MenuList id="action-menu">
                        <MenuItem
                            onClick={() => {
                                if (selectedData.length === 0) {
                                    setActionAnchorElement(null);
                                    setModalError("Please select rows for printing.");
                                } else {
                                    setSelectedAction("Print Shipping Labels");
                                    setShippingLabelsModal(true);
                                    setActionAnchorElement(null);
                                    setModalError(null);
                                }
                            }}
                        >
                            Print Shipping Labels
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                if (selectedData.length !== 1) {
                                    setActionAnchorElement(null);
                                    setModalError("Please select 1 row for printing.");
                                } else {
                                    setSelectedAction("Print Shopping list");
                                    setShoppingListModal(true);
                                    setActionAnchorElement(null);
                                    setModalError(null);
                                }
                            }}
                        >
                            Print Shopping List
                        </MenuItem>
                    </MenuList>
                </Menu>
            ) : (
                <></>
            )}
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
            {modalError === null ? (
                <></>
            ) : (
                <AlertBox>
                    <Alert severity="error">{modalError}</Alert>
                </AlertBox>
            )}
        </StyledPaper>
    );
};

export default ActionBar;
