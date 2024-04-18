import styled from "styled-components";
import { ParcelsTableRow } from "../../getParcelsTableData";
import Modal from "@/components/Modal/Modal";
import { ActionName } from "../Actions";
import { StatusType } from "../Statuses";
import React from "react";
import { UpdateParcelStatuses } from "../ActionAndStatusBar";
import { ErrorSecondaryText } from "@/app/errorStylingandMessages";

export interface ActionModalProps extends Omit<React.ComponentProps<typeof Modal>, "children"> {
    selectedParcels: ParcelsTableRow[];
    updateParcelStatuses: UpdateParcelStatuses;
    newStatus: StatusType;
    actionName: ActionName;
}

interface GeneralActionModalProps extends ActionModalProps {
    onClose: () => void;
    errorMessage: string | null;
    actionCompleted: boolean;
    successMessage: string;
    actionButton: React.ReactNode;
    contentAboveButton?: React.ReactNode;
}

export const maxParcelsToShow = 5;

export const Centerer = styled.div`
    display: flex;
    justify-content: center;
`;

export const Heading = styled.div`
    font-size: 1.2rem;
    margin: 0.3rem;
`;

export const ConfirmButtons = styled.div`
    display: flex;
    flex-direction: row;
    gap: 2rem;
    align-items: stretch;
`;

export const Paragraph = styled.p`
    font-size: 1rem;
    margin: 0.3rem;
`;

export const ModalInner = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
`;

const GeneralActionModal: React.FC<GeneralActionModalProps> = (props) => {
    return (
        <Modal {...props} onClose={props.onClose}>
            <ModalInner>
                {props.actionCompleted ? (
                    props.errorMessage ? (
                        <ErrorSecondaryText>{props.errorMessage}</ErrorSecondaryText>
                    ) : (
                        <Paragraph>{props.successMessage}</Paragraph>
                    )
                ) : (
                    <>
                        {props.contentAboveButton}
                        <Centerer>{props.actionButton}</Centerer>
                    </>
                )}
            </ModalInner>
        </Modal>
    );
};

export default GeneralActionModal;
