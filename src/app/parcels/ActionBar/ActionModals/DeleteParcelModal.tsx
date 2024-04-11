"use client";

import React, { useState } from "react";
import {
    Centerer,
    ConfirmButtons,
    Heading,
    maxParcelsToShow,
    ActionModalProps,
    ModalInner,
    Paragraph,
} from "./common";
import { Button } from "@mui/material";
import SelectedParcelsOverview from "../SelectedParcelsOverview";
import { getStatusErrorMessageWithLogId } from "../Statuses";
import Modal from "@/components/Modal/Modal";
import { ErrorSecondaryText } from "@/app/errorStylingandMessages";

const DeleteParcelModal: React.FC<ActionModalProps> = (props) => {
    const [actionCompleted, setActionCompleted] = useState(false);
    const [serverErrorMessage, setServerErrorMessage] = useState<string | null>(null);
    const updateParcelsStatuses = async (): Promise<void> => {
        const { error } = await props.updateParcelStatuses(props.selectedParcels, props.newStatus);
        if (error) {
            setServerErrorMessage(getStatusErrorMessageWithLogId(error));
        }
    };

    const onDeleteParcels = (): void => {
        updateParcelsStatuses();
        setActionCompleted(true);
    };

    const onClose = (): void => {
        props.onClose();
        setServerErrorMessage(null);
    };

    const numberOfParcelsToDelete = props.selectedParcels.length;
    return (
        <>
            (
            <Modal {...props} onClose={onClose}>
                <ModalInner>
                    {actionCompleted ? (
                        serverErrorMessage ? (
                            <ErrorSecondaryText>{serverErrorMessage}</ErrorSecondaryText>
                        ) : (
                            <Paragraph>{`${numberOfParcelsToDelete > 1 ? "Parcels" : "Parcel"} Deleted`}</Paragraph>
                        )
                    ) : (
                        <>
                            <Heading>
                                Are you sure you want to delete the selected parcel{" "}
                                {numberOfParcelsToDelete === 1 ? "request" : "requests"}?
                            </Heading>
                            <SelectedParcelsOverview
                                parcels={props.selectedParcels}
                                maxParcelsToShow={maxParcelsToShow}
                            />
                            <Centerer>
                                <ConfirmButtons>
                                    <Button variant="contained" onClick={onClose}>
                                        Cancel
                                    </Button>
                                    <Button variant="contained" onClick={() => onDeleteParcels()}>
                                        Delete
                                    </Button>
                                </ConfirmButtons>
                            </Centerer>
                        </>
                    )}
                </ModalInner>
            </Modal>
            )
        </>
    );
};

export default DeleteParcelModal;
