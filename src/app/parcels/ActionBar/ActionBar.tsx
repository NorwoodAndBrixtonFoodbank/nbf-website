"use client";

import React, { SetStateAction, useState } from "react";
import styled from "styled-components";
import Button from "@mui/material/Button";
import { ParcelsTableRow } from "@/app/parcels/getParcelsTableData";
import Alert from "@mui/material/Alert";
import Statuses from "@/app/parcels/ActionBar/Statuses";
import Actions from "@/app/parcels/ActionBar/Actions";
import { ControlContainer } from "@/components/Form/formStyling";
import { ArrowDropDown } from "@mui/icons-material";

interface Props {
    selectedRowIndices: number[];
    parcels: ParcelsTableRow[];
    setSelectedRowIndices: React.Dispatch<SetStateAction<number[]>>;
    setSelectedCheckboxes: React.Dispatch<SetStateAction<boolean[]>>;
}

const ActionsContainer = styled(ControlContainer)`
    justify-content: flex-end;
`;

const AlertBox = styled.div`
    display: block;
    padding: 0.5rem;
    border-radius: 0.5rem;
`;

const ActionBar: React.FC<Props> = (props) => {
    const [statusAnchorElement, setStatusAnchorElement] = useState<HTMLElement | null>(null);
    const [actionAnchorElement, setActionAnchorElement] = useState<HTMLElement | null>(null);

    const [modalError, setModalError] = useState<string | null>(null);

    return (
        <>
            <ActionsContainer>
                <Statuses
                    parcels={props.parcels}
                    selectedRowIndices={props.selectedRowIndices}
                    statusAnchorElement={statusAnchorElement}
                    setStatusAnchorElement={setStatusAnchorElement}
                    modalError={modalError}
                    setModalError={setModalError}
                />
                <Actions
                    parcels={props.parcels}
                    setSelectedRowIndices={props.setSelectedRowIndices}
                    selectedRowIndices={props.selectedRowIndices}
                    setSelectedCheckboxes={props.setSelectedCheckboxes}
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
