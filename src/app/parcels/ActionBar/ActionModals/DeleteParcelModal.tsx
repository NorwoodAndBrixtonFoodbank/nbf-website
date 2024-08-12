"use client";

import React, { useEffect, useRef, useState } from "react";
import {
    GeneralActionModal,
    ConfirmButtons,
    Heading,
    maxParcelsToShow,
    ActionModalProps,
} from "./GeneralActionModal";
import { Button } from "@mui/material";
import SelectedParcelsOverview from "../SelectedParcelsOverview";
import { getStatusErrorMessageWithLogId } from "../Statuses";
import { ParcelsTableRow } from "../../parcelsTable/types";

interface ContentProps {
    onClose: () => void;
    onDeleteParcels: () => void;
    numberOfParcelsToDelete: number;
    selectedParcels: ParcelsTableRow[];
}

const ModalContent: React.FC<ContentProps> = ({
    onClose,
    onDeleteParcels,
    numberOfParcelsToDelete,
    selectedParcels,
}) => {
    const elementToFocusRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        elementToFocusRef.current?.focus();
    }, []);

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
                <Button variant="contained" onClick={onDeleteParcels} ref={elementToFocusRef}>
                    Delete
                </Button>
            </ConfirmButtons>
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
                <ModalContent
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
