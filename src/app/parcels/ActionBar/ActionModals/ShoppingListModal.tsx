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
import ShoppingListPdfButton from "@/pdf/ShoppingList/ShoppingListPdfButton";
import Modal from "@/components/Modal/Modal";
import { ErrorSecondaryText } from "@/app/errorStylingandMessages";
import { ShoppingListPdfError } from "@/pdf/ShoppingList/getShoppingListData";
import { sendAuditLog } from "@/server/auditLog";

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

const getPdfErrorMessage = (error: ShoppingListPdfError): string => {
    let errorMessage = "";
    switch (error.type) {
        case "clientFetchFailed":
            errorMessage = "Failed to fetch client data for the selected parcel(s).";
            break;
        case "noMatchingClients":
            errorMessage = "No client in the database matches the client of the selected parcel.";
            break;
        case "familyFetchFailed":
            errorMessage = "Failed to fetch client's family data for the selected parcel(s).";
            break;
        case "listsFetchFailed":
            errorMessage = "Failed to fetch shopping list data.";
            break;
        case "listsCommentFetchFailed":
            errorMessage = "Failed to fetch shopping list comment.";
            break;
        case "failedToFetchParcel":
            errorMessage = "Failed to fetch parcel(s) data.";
            break;
        case "noMatchingParcels":
            errorMessage = "No parcel in the database matches the selected parcel(s).";
            break;
    }
    return `${errorMessage} LogId: ${error.logId}`;
};

const ShoppingListModal: React.FC<ActionModalProps> = (props) => {
    const [actionCompleted, setActionCompleted] = useState(false);
    const [serverErrorMessage, setServerErrorMessage] = useState<string | null>(null);
    const [pdfError, setPdfError] = useState<ShoppingListPdfError | null>(null);

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

    const onPdfCreationCompleted = (): void => {
        updateParcelsStatuses();
        setActionCompleted(true);
        void sendAuditLog({
            action: "create shopping list pdf",
            wasSuccess: true,
            content: { parcelIds: props.selectedParcels.map((parcel) => parcel.parcelId) },
        });
    };

    const onPdfCreationFailed = (pdfError: ShoppingListPdfError): void => {
        setPdfError(pdfError);
        setActionCompleted(true);
        void sendAuditLog({
            action: "create shopping list pdf",
            wasSuccess: false,
            content: { parcelIds: props.selectedParcels.map((parcel) => parcel.parcelId) },
            logId: pdfError.logId,
        });
    };

    const actionCompletedSuccessfully = actionCompleted && !serverErrorMessage && !pdfError;

    return (
        <Modal {...props} onClose={onClose}>
            <ModalInner>
                {pdfError && (
                    <ErrorSecondaryText>{getPdfErrorMessage(pdfError)}</ErrorSecondaryText>
                )}
                {serverErrorMessage && (
                    <ErrorSecondaryText>{serverErrorMessage}</ErrorSecondaryText>
                )}
                {actionCompletedSuccessfully && <Paragraph>Shopping List Created</Paragraph>}
                {!actionCompleted && (
                    <>
                        <ShoppingListsConfirmation selectedParcels={props.selectedParcels} />
                        <SelectedParcelsOverview
                            parcels={props.selectedParcels}
                            maxParcelsToShow={maxParcelsToShow}
                        />
                        <Centerer>
                            <ShoppingListPdfButton
                                text="Download"
                                parcels={props.selectedParcels}
                                onPdfCreationCompleted={onPdfCreationCompleted}
                                onPdfCreationFailed={onPdfCreationFailed}
                            />
                        </Centerer>
                    </>
                )}
            </ModalInner>
        </Modal>
    );
};

export default ShoppingListModal;
