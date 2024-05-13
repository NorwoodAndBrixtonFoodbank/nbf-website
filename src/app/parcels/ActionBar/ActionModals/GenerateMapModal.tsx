"use client";

import React, { useState } from "react";
import GeneralActionModal, { ActionModalProps } from "./GeneralActionModal";
import { Button } from "@mui/material";
import { getStatusErrorMessageWithLogId } from "../Statuses";

const GenerateMapModal: React.FC<ActionModalProps> = (props) => {
    const [actionCompleted, setActionCompleted] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const onClose = (): void => {
        props.onClose();
        setErrorMessage(null);
    };

    const onDoAction = async (): Promise<void> => {
        const { error } = await props.updateParcelStatuses(props.selectedParcels, props.newStatus);
        if (error) {
            setErrorMessage(getStatusErrorMessageWithLogId(error));
        } else {
            setSuccessMessage("Map Generated");
        }
        setActionCompleted(true);
    };

    const formattedPostcodes = Array.from(
        props.selectedParcels.reduce<Set<string>>((formattedPostcodes, parcel) => {
            if (parcel.addressPostcode) {
                formattedPostcodes.add(parcel.addressPostcode.replaceAll(" ", ""));
            }
            return formattedPostcodes;
        }, new Set())
    );

    const mapsLinkForSelectedParcels =
        "https://www.google.com/maps/dir/" + formattedPostcodes.join("/");

    return (
        <GeneralActionModal
            {...props}
            onClose={onClose}
            errorMessage={errorMessage}
            successMessage={successMessage}
            actionShown={!actionCompleted}
            actionButton={
                <Button
                    variant="contained"
                    onClick={() => {
                        if (formattedPostcodes.length === 0) {
                            setErrorMessage("No selected parcels have addresses.");
                            setActionCompleted(true);
                            return;
                        }
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
