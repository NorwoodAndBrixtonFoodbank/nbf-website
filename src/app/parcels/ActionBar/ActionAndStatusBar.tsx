"use client";

import React, { useState } from "react";
import styled from "styled-components";
import Button from "@mui/material/Button";
import { ParcelsTableRow } from "../parcelsTable/types";
import Alert from "@mui/material/Alert";
import Statuses, { StatusType, SaveParcelStatusResult } from "@/app/parcels/ActionBar/Statuses";
import Actions from "@/app/parcels/ActionBar/Actions";
import { ArrowDropDown } from "@mui/icons-material";
import { Dayjs } from "dayjs";

export interface ActionAndStatusBarProps {
    fetchSelectedParcels: () => Promise<ParcelsTableRow[]>;
    updateParcelStatuses: UpdateParcelStatuses;
}

export type UpdateParcelStatuses = (
    parcels: ParcelsTableRow[],
    newStatus: StatusType,
    statusEventData?: string,
    date?: Dayjs
) => Promise<SaveParcelStatusResult>;

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
                fetchSelectedParcels={props.fetchSelectedParcels}
                statusAnchorElement={statusAnchorElement}
                setStatusAnchorElement={setStatusAnchorElement}
                setModalError={setModalError}
            />
            <Actions
                fetchSelectedParcels={props.fetchSelectedParcels}
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
