"use client";

import React, { useEffect, useRef, useState } from "react";
import GeneralActionModal, {
    ConfirmButtons,
    Heading,
    maxParcelsToShow,
    ActionModalProps,
} from "./GeneralActionModal";
import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import SelectedParcelsOverview from "../SelectedParcelsOverview";
import { getStatusErrorMessageWithLogId } from "../Statuses";
import { ParcelsTableRow } from "../../parcelsTable/types";
import { Centerer } from "@/components/Modal/ModalFormStyles";

interface ContentProps {
    onClose: () => void;
    onDeleteParcels: () => void;
    numberOfParcelsToDelete: number;
    selectedParcels: ParcelsTableRow[];
}

const DeleteParcelModalContent: React.FC<ContentProps> = ({
    onClose,
    onDeleteParcels,
    numberOfParcelsToDelete,
    selectedParcels,
}) => {
    const modalElementToFocusRef = useRef<HTMLButtonElement>(null);
    const confirmDialogueFocusRef = useRef<HTMLButtonElement>(null);
    const [isConfirmationDialogueOpen, setIsConfirmationDialogueOpen] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            isConfirmationDialogueOpen
                ? confirmDialogueFocusRef.current?.focus()
                : modalElementToFocusRef.current?.focus();
        }, 0);
    }, [isConfirmationDialogueOpen]);

    return (
        <>
            <Heading>
                Are you sure you want to delete the selected parcel{" "}
                {numberOfParcelsToDelete === 1 ? "request" : "requests"}?
            </Heading>
            <SelectedParcelsOverview
                parcels={selectedParcels}
                maxParcelsToShow={maxParcelsToShow}
            />
            <ConfirmButtons>
                <Button variant="contained" onClick={onClose}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={() => setIsConfirmationDialogueOpen(true)}
                    ref={modalElementToFocusRef}
                >
                    Delete
                </Button>
            </ConfirmButtons>
            <Dialog
                open={isConfirmationDialogueOpen}
                onClose={() => setIsConfirmationDialogueOpen(false)}
            >
                <DialogTitle id="alert-dialog-title">
                    Please confirm you wish to delete the selected parcel/s.
                </DialogTitle>
                <Centerer>
                    <DialogActions>
                        <Button onClick={() => setIsConfirmationDialogueOpen(false)}>Cancel</Button>
                        <Button onClick={onDeleteParcels} ref={confirmDialogueFocusRef}>
                            Confirm
                        </Button>
                    </DialogActions>
                </Centerer>
            </Dialog>
        </>
    );
};

const DeleteParcelModal: React.FC<ActionModalProps> = (props) => {
    const [actionCompleted, setActionCompleted] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const numberOfParcelsToDelete = props.selectedParcels.length;

    const onDeleteParcels = async (): Promise<void> => {
        const { error } = await props.updateParcelStatuses(props.selectedParcels, "Parcel Deleted");
        if (error) {
            setErrorMessage(getStatusErrorMessageWithLogId(error));
        } else {
            setSuccessMessage(`${numberOfParcelsToDelete > 1 ? "Parcels" : "Parcel"} Deleted`);
        }
        setActionCompleted(true);
    };

    const onClose = (): void => {
        props.onClose();
        setErrorMessage(null);
    };

    return (
        <GeneralActionModal
            {...props}
            onClose={onClose}
            errorMessage={errorMessage}
            successMessage={successMessage}
        >
            {!actionCompleted && (
                <DeleteParcelModalContent
                    selectedParcels={props.selectedParcels}
                    numberOfParcelsToDelete={numberOfParcelsToDelete}
                    onClose={onClose}
                    onDeleteParcels={onDeleteParcels}
                />
            )}
        </GeneralActionModal>
    );
};
export default DeleteParcelModal;
