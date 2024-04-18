"use client";

import React, { useState } from "react";
import GeneralActionModal, {
    ConfirmButtons,
    Heading,
    maxParcelsToShow,
    ActionModalProps,
} from "./GeneralActionModal";
import { Button } from "@mui/material";
import SelectedParcelsOverview from "../SelectedParcelsOverview";
import { getStatusErrorMessageWithLogId } from "../Statuses";

const DeleteParcelModal: React.FC<ActionModalProps> = (props) => {
    const [actionCompleted, setActionCompleted] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const onDeleteParcels = async (): Promise<void> => {
        const { error } = await props.updateParcelStatuses(props.selectedParcels, props.newStatus);
        if (error) {
            setErrorMessage(getStatusErrorMessageWithLogId(error));
        }
        setActionCompleted(true);
    };

    const onClose = (): void => {
        props.onClose();
        setErrorMessage(null);
    };

    const numberOfParcelsToDelete = props.selectedParcels.length;
    const successMessage = `${numberOfParcelsToDelete > 1 ? "Parcels" : "Parcel"} Deleted`;

    return (
        <GeneralActionModal
            {...props}
            onClose={onClose}
            errorMessage={errorMessage}
            successMessage={successMessage}
            actionHidden={actionCompleted}
            actionButton={
                <ConfirmButtons>
                    <Button variant="contained" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={() => onDeleteParcels()}>
                        Delete
                    </Button>
                </ConfirmButtons>
            }
            contentAboveButton={
                <>
                    <Heading>
                        Are you sure you want to delete the selected parcel{" "}
                        {numberOfParcelsToDelete === 1 ? "request" : "requests"}?
                    </Heading>
                    <SelectedParcelsOverview
                        parcels={props.selectedParcels}
                        maxParcelsToShow={maxParcelsToShow}
                    />
                </>
            }
        />
    );
};
export default DeleteParcelModal;
