"use client";

import React, { useState } from "react";
import styled from "styled-components";
import Button from "@mui/material/Button";
import { ParcelsTableRow } from "@/app/parcels/getParcelsTableData";
import Alert from "@mui/material/Alert";
import Statuses from "@/app/parcels/ActionBar/Statuses";
import Actions from "@/app/parcels/ActionBar/Actions";
import { ControlContainer } from "@/components/Form/formStyling";
import { ArrowDropDown } from "@mui/icons-material";

export interface ActionBarProps {
    selectedParcels: ParcelsTableRow[];
    onDeleteParcels: (parcels: ParcelsTableRow[]) => void;
}

const ActionsContainer = styled(ControlContainer)`
    justify-content: flex-end;
`;

const AlertBox = styled.div`
    display: block;
    padding: 0.5rem;
    border-radius: 0.5rem;
`;

const ActionBar: React.FC<ActionBarProps> = (props) => {
    const [statusAnchorElement, setStatusAnchorElement] = useState<HTMLElement | null>(null);
    const [actionAnchorElement, setActionAnchorElement] = useState<HTMLElement | null>(null);

    const [modalError, setModalError] = useState<string | null>(null);

    return (
        <>
            <ActionsContainer>
                <Statuses
                    selectedParcels={props.selectedParcels}
                    statusAnchorElement={statusAnchorElement}
                    setStatusAnchorElement={setStatusAnchorElement}
                    modalError={modalError}
                    setModalError={setModalError}
                />
                <Actions
                    selectedParcels={props.selectedParcels}
                    onDeleteParcels={props.onDeleteParcels}
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
            </ActionsContainer>
        </>
    );
};

export default ActionBar;
