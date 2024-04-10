"use client";

import React, { useState } from "react";
import styled from "styled-components";
import Button from "@mui/material/Button";
import { ParcelsTableRow } from "@/app/parcels/getParcelsTableData";
import Alert from "@mui/material/Alert";
import Statuses, { StatusType } from "@/app/parcels/ActionBar/Statuses";
import Actions from "@/app/parcels/ActionBar/Actions";
import { ArrowDropDown } from "@mui/icons-material";

export interface ActionAndStatusButtonsProps {
    fetchParcelsByIds: (checkedParcelIds: string[]) => Promise<ParcelsTableRow[]>;
    onActionCompleted: (
        parcels: ParcelsTableRow[],
        newStatus: StatusType,
        auditLogActionMessage: string,
        statusEventData?: string
    ) => void;
    willSaveParcelStatus: () => void;
    hasSavedParcelStatus: () => void;
    parcelIds: string[];
}

const AlertBox = styled.div`
    display: block;
    padding: 0.5rem;
    border-radius: 0.5rem;
`;

const ActionAndStatusButtons: React.FC<ActionAndStatusButtonsProps> = (props) => {
    const [statusAnchorElement, setStatusAnchorElement] = useState<HTMLElement | null>(null);
    const [actionAnchorElement, setActionAnchorElement] = useState<HTMLElement | null>(null);

    const [modalError, setModalError] = useState<string | null>(null);

    return (
        <>
            <Statuses
                fetchParcelsByIds={props.fetchParcelsByIds}
                parcelIds={props.parcelIds}
                statusAnchorElement={statusAnchorElement}
                setStatusAnchorElement={setStatusAnchorElement}
                modalError={modalError}
                setModalError={setModalError}
                willSaveParcelStatus={props.willSaveParcelStatus}
                hasSavedParcelStatus={props.hasSavedParcelStatus}
            />
            <Actions
                parcelIds={props.parcelIds}
                fetchParcelsByIds={props.fetchParcelsByIds}
                onActionCompleted={props.onActionCompleted}
                actionAnchorElement={actionAnchorElement}
                setActionAnchorElement={setActionAnchorElement}
                modalError={modalError}
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

export default ActionAndStatusButtons;
