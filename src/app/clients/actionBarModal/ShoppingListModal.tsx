"use client";

import React from "react";
import styled from "styled-components";
import Modal from "@/components/Modal/Modal";
import dayjs from "dayjs";
import { ParcelsTableRow } from "@/app/clients/getClientsTableData";
import ShoppingList from "@/pdf/ShoppingList/ShoppingList";

interface SharedModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: ParcelsTableRow;
    status: string | null;
    header: string;
    headerId: string;
    errorText: string | null;
}

const Centerer = styled.div`
    display: flex;
    justify-content: center;
`;

const ModalInner = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
`;

const StatusText = styled.p`
    margin-left: 1rem;
    border-top: 1px solid darkgrey;
    padding: 1rem 0;
    &:last-child {
        border-bottom: 1px solid darkgrey;
    }
`;

const ShoppingListModal: React.FC<SharedModalProps> = (props) => {
    const parcelId = props.data.parcelId;

    return (
        <Modal {...props} header={props.header} headerId={props.headerId}>
            <ModalInner>
                Parcels selected for printing:
                <div>
                    <StatusText>
                        {props.data.deliveryCollection.collectionCentreAcronym}
                        {props.data.fullName && ` - ${props.data.fullName}`}
                        {props.data.collectionDatetime &&
                            `\n @ ${dayjs(props.data.collectionDatetime!).format(
                                "DD/MM/YYYY HH:mm"
                            )}`}
                    </StatusText>
                </div>
                {props.errorText && <small>{props.errorText}</small>}
                <Centerer>
                    <ShoppingList text="Print" parcelId={parcelId} />
                </Centerer>
            </ModalInner>
        </Modal>
    );
};

export default ShoppingListModal;
