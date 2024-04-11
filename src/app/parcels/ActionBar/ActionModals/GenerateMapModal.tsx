"use client";

import React, { useState } from "react";
import { Centerer, ActionModalProps, ModalInner, Paragraph } from "./common";
import { Button } from "@mui/material";
import { getStatusErrorMessageWithLogId } from "../Statuses";
import Modal from "@/components/Modal/Modal";
import { ErrorSecondaryText } from "@/app/errorStylingandMessages";

const GenerateMapModal: React.FC<ActionModalProps> = (props) => {
    const [actionCompleted, setActionCompleted] = useState(false);
    const [serverErrorMessage, setServerErrorMessage] = useState<string | null>(null);
    const updateParcelsStatuses = async (): Promise<void> => {
        const { error } = await props.updateParcelStatuses(props.selectedParcels, props.newStatus);
        if (error) {
            setServerErrorMessage(getStatusErrorMessageWithLogId(error));
        }
    };

    const onClose = (): void => {
        props.onClose();
        setServerErrorMessage(null);
    };

    const onDoAction = (): void => {
        updateParcelsStatuses();
        setActionCompleted(true);
    };
    return (
        <Modal {...props} onClose={onClose}>
            <ModalInner>
                {actionCompleted ? (
                    serverErrorMessage ? (
                        <ErrorSecondaryText>{serverErrorMessage}</ErrorSecondaryText>
                    ) : (
                        <Paragraph>Map Generated</Paragraph>
                    )
                ) : (
                    <Centerer>
                        <Button
                            variant="contained"
                            onClick={() => {
                                const mapsLinkForSelectedParcels =
                                    "https://www.google.com/maps/dir/" +
                                    props.selectedParcels
                                        .map((parcel) => parcel.addressPostcode.replaceAll(" ", ""))
                                        .join("/") +
                                    "//";
                                const openInNewTab = (url: string): void => {
                                    window.open(url, "_blank", "noopener, noreferrer");
                                };
                                openInNewTab(mapsLinkForSelectedParcels);
                                onDoAction();
                            }}
                        >
                            Generate Map
                        </Button>
                    </Centerer>
                )}
            </ModalInner>
        </Modal>
    );
};

export default GenerateMapModal;
