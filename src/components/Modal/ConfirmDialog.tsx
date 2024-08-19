"use client";

import React, { useEffect } from "react";
import Modal from "@/components/Modal/Modal";
import styled from "styled-components";
import Button from "@mui/material/Button/Button";
import { Centerer } from "./ModalFormStyles";
import DeleteButton from "../Buttons/DeleteButton";
import { ButtonWrap } from "../Buttons/GeneralButtonParts";

interface Props {
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ModalInner = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
    text-align: center;
    font-size: 1.5rem;
`;

export const ConfirmButtons = styled.div`
    display: flex;
    flex-direction: row;
    gap: 2rem;
    align-items: stretch;
`;

const ConfirmDeleteModal: React.FC<Props> = ({ isOpen, message, onCancel, onConfirm }) => {
    const deleteButtonFocusRef = React.useRef<HTMLButtonElement>(null);

    useEffect(() => {
        setTimeout(() => {
            deleteButtonFocusRef.current?.focus();
        }, 0);
    }, [isOpen]);

    return (
        <Modal isOpen={isOpen} onClose={onCancel} header="Confirm" headerId="confirmDeleteModal">
            <ModalInner>
                {message}
                <Centerer>
                    <ConfirmButtons>
                        <ButtonWrap>
                            <Button variant="outlined" onClick={onCancel}>
                                Cancel
                            </Button>
                        </ButtonWrap>
                        <DeleteButton onClick={onConfirm} ref={deleteButtonFocusRef}>
                            Delete
                        </DeleteButton>
                    </ConfirmButtons>
                </Centerer>
            </ModalInner>
        </Modal>
    );
};

export default ConfirmDeleteModal;
