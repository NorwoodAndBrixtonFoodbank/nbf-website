"use client";

import React, { useState } from "react";
import styled from "styled-components";
import Button from "@mui/material/Button";
import { ClientsTableRow } from "@/app/clients/getClientsTableData";
import Paper from "@mui/material/Paper/Paper";
import Alert from "@mui/material/Alert";
import Statuses from "@/app/clients/ActionBar/Statuses";
import Actions from "@/app/clients/ActionBar/Actions";

interface Props {
    selected: number[];
    data: ClientsTableRow[];
}

const OuterDiv = styled.div`
    display: flex;
    padding: 1rem;
    gap: 0.5rem;
    border-radius: 0.5rem;
    background-color: ${(props) => props.theme.main.background[5]};
`;

const AlertBox = styled.div`
    padding: 0.5rem 1rem 1rem;
    border-radius: 0.5rem;
`;

const StyledPaper = styled(Paper)`
    margin: 1rem;
`;

const ActionBar: React.FC<Props> = (props) => {
    const [statusAnchorElement, setStatusAnchorElement] = useState<HTMLElement | null>(null);
    const [actionAnchorElement, setActionAnchorElement] = useState<HTMLElement | null>(null);

    const [modalError, setModalError] = useState<string | null>(null);

    return (
        <StyledPaper>
            <Statuses
                {...props}
                statusAnchorElement={statusAnchorElement}
                setStatusAnchorElement={setStatusAnchorElement}
                modalError={modalError}
                setModalError={setModalError}
            />
            <Actions
                {...props}
                actionAnchorElement={actionAnchorElement}
                setActionAnchorElement={setActionAnchorElement}
                modalError={modalError}
                setModalError={setModalError}
            />
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
            {modalError && (
                <AlertBox>
                    <Alert severity="error">{modalError}</Alert>
                </AlertBox>
            )}
        </StyledPaper>
    );
};

export default ActionBar;
