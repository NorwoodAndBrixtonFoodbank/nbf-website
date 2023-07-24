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
        margin: 5%;
        overflow: hidden;
        max-width: 90%;
    }
`;

const Header = styled.div`
    display: flex;
    position: sticky;
    justify-content: space-between;
    align-items: center;
    color: ${(props) => props.theme.secondaryForegroundColor};
    // TODO VFB-16 Change to using theme with palettes of colours
    background-color: ${(props) => props.theme.secondaryBackgroundColor}A0;
    font-size: 1.5em;
    font-weight: bolder;
    padding: 0.75em 1em;
    width: 100%;
`;

const Content = styled.div`
    overflow: auto;
    padding: 1em 1.5em 1.5em;
    width: 100%;
`;

const CloseButton = styled.button.attrs({
    "aria-label": "Close Button",
})`
    border: 0;
    border-radius: 50%;

    // TODO VFB-16 Change to using theme with palettes of colours
    color: grey;

    display: flex;
    justify-content: center;
    aspect-ratio: 1;
    align-items: center;
    transition: 0.2s;
    margin-left: 1em;

    &:hover {
        // TODO VFB-16 Change to using theme with palettes of colours
        color: white;
        background-color: darkgray;
    }
`;

interface ModalProps {
    header: ReactNode;
    children: ReactNode;
    isOpen: boolean;
    onClose: () => void;
    ariaLabel?: string;
}

const Modal: React.FC<ModalProps> = (props) => {
    return (
        <StyledDialog open={props.isOpen} onClose={props.onClose} aria-label={props.ariaLabel}>
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
