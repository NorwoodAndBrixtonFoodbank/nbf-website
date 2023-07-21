"use client";

import React, { ReactNode } from "react";
import styled from "styled-components";
import { Dialog } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const StyledDialog = styled(Dialog)`
    & .MuiPaper-root {
        border: 0;
        border-radius: 2em;
        padding: 0;
        margin: 0;
        overflow: hidden;
    }
`;

const Header = styled.div`
    display: flex;
    position: sticky;
    justify-content: space-between;
    align-items: center;
    color: ${(props) => props.theme.secondaryForegroundColor};
    background-color: ${(props) => props.theme.secondaryBackgroundColor}A0;
    font-size: 1.5em;
    font-weight: bolder;
    padding: 0.75em 1em;
`;

const Content = styled.div`
    overflow: auto;
    background-color: ${(props) => props.theme.surfaceBackgroundColor};
    margin: 1rem 1.5rem 1.5rem;
`;

const CloseButton = styled.button.attrs({
    "aria-label": "Close Button",
})`
    border: 0;
    border-radius: 50%;
    color: grey;
    display: flex;
    justify-content: center;
    aspect-ratio: 1;
    align-items: center;
    transition: 0.2s;
    margin-left: 1em;

    &:hover {
        color: white;
        background-color: darkgray;
    }
`;

interface ModalProps {
    header: ReactNode;
    children: ReactNode;
    isOpen: boolean;
    onClose: () => void;
    ariaLabelledBy?: string;
    ariaDescribedBy?: string;
}

const Modal: React.FC<ModalProps> = (props) => {
    return (
        <StyledDialog
            open={props.isOpen}
            onClose={props.onClose}
            aria-labelledby={props.ariaLabelledBy}
            aria-describedby={props.ariaDescribedBy}
        >
            <Header>
                {props.header}
                <CloseButton onClick={props.onClose}>
                    <CloseIcon />
                </CloseButton>
            </Header>
            <Content>{props.children}</Content>
        </StyledDialog>
    );
};

export default Modal;
