"use client";

import React from "react";
import styled from "styled-components";
import ShippingLabels from "@/pdf/ShippingLabels/ShippingLabels";
import Modal from "@/components/Modal/Modal";
import dayjs from "dayjs";
import { ParcelsTableRow } from "@/app/clients/getClientsTableData";

interface SharedModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: ParcelsTableRow[];
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

const ShippingLabelsModal: React.FC<SharedModalProps> = (props) => {
    const parcelIds = props.data.map((parcel) => {
        return parcel.parcelId;
    });

    return (
        <Modal {...props} header={props.header} headerId={props.headerId}>
            <ModalInner>
                Parcels selected for printing:
                <div>
                    {props.data.map((parcel, index) => {
                        return (
                            <StatusText key={index}>
                                {parcel.deliveryCollection.collectionCentre}
                                {parcel.fullName && ` - ${parcel.fullName}`}
                                {parcel.collectionDatetime &&
                                    `\n @ ${dayjs(parcel.collectionDatetime!).format(
                                        "DD/MM/YYYY HH:mm"
                                    )}`}
                            </StatusText>
                        );
                    })}
                </div>
                {props.errorText && <small>{props.errorText}</small>}
                <Centerer>
                    <ShippingLabels text="Print" parcelIds={parcelIds} />
                </Centerer>
            </ModalInner>
        </Modal>
    );
};

export default ShippingLabelsModal;
