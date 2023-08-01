"use client";

import React, { ReactNode } from "react";
import styled from "styled-components";
import { Dialog } from "@mui/material";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import Icon from "../Icons/Icon";

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

    // TODO VFB-16 Add the equivalent of this colour to a palette without the transparency
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

    // TODO VFB-16 There are two options for the CloseButton styling. Either using a series of grey tones, or colours that match the theme of the modal

    // TODO VFB-16 Either change to 'grey' or same colour as Header background
    background-color: ${(props) => props.theme.secondaryBackgroundColor};

    // TODO VFB-16 Ensure that this colour matches the header font colour
    color: ${(props) => props.theme.secondaryForegroundColor};

    display: flex;
    justify-content: center;
    aspect-ratio: 1;
    align-items: center;
    transition: 0.2s;
    margin-left: 1em;

    &:hover {
        // TODO VFB-16 Either change to 'white' or the corresponding 'secondaryBackgroundColor'
        color: ${(props) => props.theme.secondaryBackgroundColor};

        // TODO VFB-16 Either change to 'darkgray' or the corresponding 'secondaryForegroundColor'
        background-color: ${(props) => props.theme.secondaryForegroundColor};
    }
`;

interface ModalProps {
    header: ReactNode;
    children: ReactNode;
    isOpen: boolean;
    onClose: () => void;
    headerId: string;
}

const Modal: React.FC<ModalProps> = (props) => {
    return (
        <StyledDialog open={props.isOpen} onClose={props.onClose} aria-labelledby={props.headerId}>
            <Header id={props.headerId}>
                {props.header}
                <CloseButton onClick={props.onClose}>
                    <Icon icon={faClose} />
                </CloseButton>
            </Header>
            <Content>{props.children}</Content>
        </StyledDialog>
    );
};

export default Modal;
