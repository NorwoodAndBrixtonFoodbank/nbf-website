"use client";

import React, { useState } from "react";
import {
    Centerer,
    Heading,
    maxParcelsToShow,
    ActionModalProps,
    ModalInner,
    Paragraph,
} from "./common";
import SelectedParcelsOverview from "../SelectedParcelsOverview";
import FreeFormTextInput from "@/components/DataInput/FreeFormTextInput";
import { ParcelsTableRow } from "../../getParcelsTableData";
import ShippingLabels from "@/pdf/ShippingLabels/ShippingLabels";
import { getStatusErrorMessageWithLogId } from "../Statuses";
import Modal from "@/components/Modal/Modal";
import { ErrorSecondaryText } from "@/app/errorStylingandMessages";

interface ShippingLabelsInputProps {
    onLabelQuantityChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ShippingLabelsInput: React.FC<ShippingLabelsInputProps> = ({ onLabelQuantityChange }) => {
    return (
        <>
            <Heading>Shipping Labels</Heading>
            <FreeFormTextInput type="number" onChange={onLabelQuantityChange} label="Quantity" />
        </>
    );
};

interface ShippingLabelsButtonProps {
    selectedParcels: ParcelsTableRow[];
    labelQuantity: number;
    onDoAction: (labelQuantity: number) => void;
}

const ShippingLabelsModalButton: React.FC<ShippingLabelsButtonProps> = ({
    selectedParcels,
    labelQuantity,
    onDoAction,
}) => {
    return (
        <ShippingLabels
            text="Download"
            parcelId={selectedParcels[0].parcelId}
            labelQuantity={labelQuantity}
            onClick={() => onDoAction(labelQuantity)}
        />
    );
};

const ShippingLabelModal: React.FC<ActionModalProps> = (props) => {
    const [actionCompleted, setActionCompleted] = useState(false);
    const [serverErrorMessage, setServerErrorMessage] = useState<string | null>(null);
    const updateParcelsStatuses = async (labelQuantity: number): Promise<void> => {
        const { error } = await props.updateParcelStatuses(
            props.selectedParcels,
            props.newStatus,
            labelQuantity.toString()
        );
        if (error) {
            setServerErrorMessage(getStatusErrorMessageWithLogId(error));
        }
    };

    const [labelQuantity, setLabelQuantity] = useState<number>(0);

    const onLabelQuantityChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setLabelQuantity(parseInt(event.target.value, 10) ?? 0);
    };

    const onClose = (): void => {
        props.onClose();
        setLabelQuantity(0);
        setServerErrorMessage(null);
    };

    const onDoAction = (): void => {
        updateParcelsStatuses(labelQuantity);
        setActionCompleted(true);
    };

    return (
        <Modal {...props} onClose={onClose}>
            <ModalInner>
                {actionCompleted ? (
                    serverErrorMessage ? (
                        <ErrorSecondaryText>{serverErrorMessage}</ErrorSecondaryText>
                    ) : (
                        <Paragraph>Shipping Labels Created</Paragraph>
                    )
                ) : (
                    <>
                        <ShippingLabelsInput onLabelQuantityChange={onLabelQuantityChange} />
                        <SelectedParcelsOverview
                            parcels={props.selectedParcels}
                            maxParcelsToShow={maxParcelsToShow}
                        />
                        <Centerer>
                            <ShippingLabelsModalButton
                                selectedParcels={props.selectedParcels}
                                labelQuantity={labelQuantity}
                                onDoAction={onDoAction}
                            />
                        </Centerer>
                    </>
                )}
            </ModalInner>
        </Modal>
    );
};

export default ShippingLabelModal;
