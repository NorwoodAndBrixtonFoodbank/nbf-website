"use client";

import React, { ReactNode } from "react";
import styled from "styled-components";
import { Dialog } from "@mui/material";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import Icon from "@/components/Icons/Icon";

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

const Header = styled.h1`
    display: flex;
    position: sticky;
    justify-content: space-between;
    align-items: center;
    color: ${(props) => props.theme.primary.largeForeground[2]};
    background-color: ${(props) => props.theme.primary.background[2]};

    font-size: 1.5em;
    font-weight: bolder;
    padding: 0.75em 1em;
    width: 100%;
`;

const Content = styled.div`
    overflow: auto;
    padding: 1em 1.5em 1.5em;
    width: 100%;
    color: ${(props) => props.theme.main.foreground[1]};
    background-color: ${(props) => props.theme.main.background[1]};
`;

const CloseButton = styled.button.attrs({
    "aria-label": "Close Button",
})`
    border: 0;
    border-radius: 50%;
    background-color: ${(props) => props.theme.rainbow.color.grey[0]};
    color: ${(props) => props.theme.rainbow.color.grey[2]};

    display: flex;
    justify-content: center;
    aspect-ratio: 1;
    align-items: center;
    transition: 0.2s;
    margin-left: 1em;

    &:hover {
        color: ${(props) => props.theme.rainbow.color.grey[0]};
        background-color: ${(props) => props.theme.rainbow.color.grey[2]};
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
