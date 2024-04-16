"use client";

import React, { useState } from "react";
import styled from "styled-components";
import Button from "@mui/material/Button";
import { ParcelsTableRow } from "@/app/parcels/getParcelsTableData";
import Alert from "@mui/material/Alert";
import Statuses, { StatusType, SaveParcelStatusReturnType } from "@/app/parcels/ActionBar/Statuses";
import Actions from "@/app/parcels/ActionBar/Actions";
import { ArrowDropDown } from "@mui/icons-material";

export interface ActionAndStatusBarProps {
    fetchParcelsByIds: () => Promise<ParcelsTableRow[]>;
    updateParcelStatuses: (
        parcels: ParcelsTableRow[],
        newStatus: StatusType,
        statusEventData?: string
    ) => Promise<SaveParcelStatusReturnType>;
    willSaveParcelStatus: () => void;
    hasSavedParcelStatus: () => void;
}

const AlertBox = styled.div`
    display: block;
    padding: 0.5rem;
    border-radius: 0.5rem;
`;

const ActionAndStatusBar: React.FC<ActionAndStatusBarProps> = (props) => {
    const [statusAnchorElement, setStatusAnchorElement] = useState<HTMLElement | null>(null);
    const [actionAnchorElement, setActionAnchorElement] = useState<HTMLElement | null>(null);

    const [modalError, setModalError] = useState<string | null>(null);

    return (
        <>
            <Statuses
                fetchParcelsByIds={props.fetchParcelsByIds}
                statusAnchorElement={statusAnchorElement}
                setStatusAnchorElement={setStatusAnchorElement}
                setModalError={setModalError}
                willSaveParcelStatus={props.willSaveParcelStatus}
                hasSavedParcelStatus={props.hasSavedParcelStatus}
            />
            <Actions
                fetchParcelsByIds={props.fetchParcelsByIds}
                updateParcelStatuses={props.updateParcelStatuses}
                actionAnchorElement={actionAnchorElement}
                setActionAnchorElement={setActionAnchorElement}
                setModalError={setModalError}
            />
            {modalError && (
                <AlertBox>
                    <Alert severity="error">{modalError}</Alert>
                </AlertBox>
            )}
            <Button
                variant="contained"
                onClick={(event) => setStatusAnchorElement(event.currentTarget)}
                type="button"
                id="status-button"
                endIcon={<ArrowDropDown />}
            >
                Statuses
            </Button>
            <Button
                variant="contained"
                onClick={(event) => setActionAnchorElement(event.currentTarget)}
                type="button"
                id="action-button"
                endIcon={<ArrowDropDown />}
            >
                Actions
            </Button>
        </>
    );
};

export default ActionAndStatusBar;
