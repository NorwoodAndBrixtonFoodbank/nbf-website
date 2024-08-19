import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";
import { Centerer } from "./ModalFormStyles";
import React, { useEffect } from "react";

interface DeleteConfirmationDialogueProps {
    isOpen: boolean;
    onClose: () => void;
    onClickCancel: () => void;
    onClickConfirm: () => void;
    deletionText: string;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogueProps> = ({
    isOpen,
    onClose,
    onClickCancel,
    onClickConfirm,
    deletionText,
}) => {
    const confirmButtonFocusRef = React.useRef<HTMLButtonElement>(null);

    useEffect(() => {
        setTimeout(() => {
            confirmButtonFocusRef.current?.focus();
        }, 0);
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onClose={onClose}>
            <DialogTitle id="alert-dialog-title">{deletionText}</DialogTitle>
            <Centerer>
                <DialogActions>
                    <Button onClick={onClickCancel}>Cancel</Button>
                    <Button onClick={onClickConfirm} ref={confirmButtonFocusRef}>
                        Confirm
                    </Button>
                </DialogActions>
            </Centerer>
        </Dialog>
    );
};

export default DeleteConfirmationDialog;
