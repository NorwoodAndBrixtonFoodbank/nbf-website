"use client";

import React from "react";
import Modal from "@/components/Modal/Modal";
import styled from "styled-components";
import Button from "@mui/material/Button/Button";

interface Props {
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    errorMessage: string | null;
}

const ModalInner = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
    text-align: center;
    font-size: 1.5rem;
`;

const Text = styled.p`
    font-size: 1.2rem;
`;

const ErrorText = styled.p`
    color: red;
`;

const ConfirmDialog: React.FC<Props> = ({ isOpen, message, onCancel, onConfirm, errorMessage }) => {
    return (
        <Modal isOpen={isOpen} onClose={onCancel} header="Confirm" headerId="confirmDialog">
            <ModalInner>
                <Text>{message}</Text>
                <Button onClick={onConfirm} variant="contained" color="primary">
                    <p>Confirm</p>
                </Button>
                {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
            </ModalInner>
        </Modal>
    );
};

export default ConfirmDialog;
