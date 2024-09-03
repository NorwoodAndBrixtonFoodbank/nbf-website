import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";
import { Centerer } from "./ModalFormStyles";
import React, { useCallback, useEffect } from "react";

interface DeleteConfirmationDialogueProps {
    isOpen: boolean;
    closeModal: () => void;
    onConfirm: () => void;
    deletionText: string;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogueProps> = ({
    isOpen,
    closeModal,
    onConfirm,
    deletionText,
}) => {
    const confirmButtonFocusRef = React.useRef<HTMLButtonElement>(null);

    useEffect(() => {
        setTimeout(() => {
            confirmButtonFocusRef.current?.focus();
        }, 0);
    }, [isOpen]);

    const onClickConfirm = useCallback(() => {
        onConfirm();
        closeModal();
    }, [onConfirm, closeModal]);

    return (
        <Dialog open={isOpen} onClose={closeModal}>
            <DialogTitle id="alert-dialog-title">{deletionText}</DialogTitle>
            <Centerer>
                <DialogActions>
                    <Button onClick={closeModal}>Cancel</Button>
                    <Button onClick={onClickConfirm} ref={confirmButtonFocusRef}>
                        Confirm
                    </Button>
                </DialogActions>
            </Centerer>
        </Dialog>
    );
};

export default DeleteConfirmationDialog;
