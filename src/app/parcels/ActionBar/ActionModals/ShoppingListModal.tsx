"use client";

import React, { useState } from "react";
import {
    Centerer,
    Heading,
    Paragraph,
    maxParcelsToShow,
    ActionModalProps,
    ModalInner,
} from "./common";
import SelectedParcelsOverview from "../SelectedParcelsOverview";
import { ParcelsTableRow } from "../../getParcelsTableData";
import { StatusType, getStatusErrorMessageWithLogId } from "../Statuses";
import ShoppingList from "@/pdf/ShoppingList/ShoppingList";
import Modal from "@/components/Modal/Modal";
import { ErrorSecondaryText } from "@/app/errorStylingandMessages";

interface ShoppingListsConfirmationProps {
    selectedParcels: ParcelsTableRow[];
}

const ShoppingListsConfirmation: React.FC<ShoppingListsConfirmationProps> = ({
    selectedParcels,
}) => {
    const maxPostcodesToShow = 4;
    const statusToFind: StatusType = "Shopping List Downloaded";

    const printedListPostcodes = selectedParcels
        .filter((parcel) => parcel.lastStatus?.name.startsWith(statusToFind))
        .map((parcel) => parcel.addressPostcode);

    return printedListPostcodes.length > 0 ? (
        <>
            <Heading>Shopping Lists</Heading>
            <Paragraph>
                Lists have already been printed for {printedListPostcodes.length} parcels with
                postcodes:
                {printedListPostcodes.slice(0, maxPostcodesToShow).join(", ")}
                {printedListPostcodes.length > maxPostcodesToShow ? ", ..." : "."}
            </Paragraph>
            <Paragraph>Are you sure you want to print again?</Paragraph>
        </>
    ) : (
        <></>
    );
};

interface ShoppingListButtonProps {
    selectedParcels: ParcelsTableRow[];
    onDoAction: () => void;
}

const ShoppingListModalButton: React.FC<ShoppingListButtonProps> = ({
    selectedParcels,
    onDoAction,
}) => {
    return (
        <ShoppingList
            text="Download"
            parcelIds={selectedParcels.map((parcel: ParcelsTableRow) => {
                return parcel.parcelId;
            })}
            onClick={onDoAction}
        />
    );
};

const ShoppingListModal: React.FC<ActionModalProps> = (props) => {
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
                        <Paragraph>Shopping List Created</Paragraph>
                    )
                ) : (
                    <>
                        <ShoppingListsConfirmation selectedParcels={props.selectedParcels} />
                        <SelectedParcelsOverview
                            parcels={props.selectedParcels}
                            maxParcelsToShow={maxParcelsToShow}
                        />
                        <Centerer>
                            <ShoppingListModalButton
                                selectedParcels={props.selectedParcels}
                                onDoAction={onDoAction}
                            />
                        </Centerer>
                    </>
                )}
            </ModalInner>
        </Modal>
    );
};

export default ShoppingListModal;
