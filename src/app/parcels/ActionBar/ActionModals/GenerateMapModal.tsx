"use client";

import React, { useState } from "react";
import GeneralActionModal, { ActionModalProps } from "./GeneralActionModal";
import { Button } from "@mui/material";
import { getStatusErrorMessageWithLogId } from "../Statuses";

const GenerateMapModal: React.FC<ActionModalProps> = (props) => {
    const [actionCompleted, setActionCompleted] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const onClose = (): void => {
        props.onClose();
        setErrorMessage(null);
    };

    const onDoAction = async (): Promise<void> => {
        const { error } = await props.updateParcelStatuses(props.selectedParcels, props.newStatus);
        if (error) {
            setErrorMessage(getStatusErrorMessageWithLogId(error));
        }
        setActionCompleted(true);
    };

    return (
        <GeneralActionModal
            {...props}
            onClose={onClose}
            errorMessage={errorMessage}
            successMessage="Map Generated"
            actionCompleted={actionCompleted}
            actionButton={
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
            }
        />
    );
};

export default GenerateMapModal;
