import styled from "styled-components";
import { ParcelsTableRow } from "../../getParcelsTableData";
import Modal from "@/components/Modal/Modal";
import { ActionName } from "../Actions";
import { StatusType, SaveParcelStatusReturnType } from "../Statuses";
import React from "react";

export interface ActionModalProps extends Omit<React.ComponentProps<typeof Modal>, "children"> {
    selectedParcels: ParcelsTableRow[];
    updateParcelStatuses: (
        parcels: ParcelsTableRow[],
        newStatus: StatusType,
        statusEventData?: string
    ) => Promise<SaveParcelStatusReturnType>;
    newStatus: StatusType;
    actionName: ActionName;
}

export interface ActionModalContentProps {
    selectedParcels: ParcelsTableRow[];
    onDoAction: (labelQuantity?: number) => void;
    onCancelAction: () => void;
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
