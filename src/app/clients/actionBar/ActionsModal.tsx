"use client";

import React, { useState } from "react";
import styled from "styled-components";
import ShippingLabels from "@/pdf/ShippingLabels/ShippingLabels";
import Modal from "@/components/Modal/Modal";
import dayjs, { Dayjs } from "dayjs";
import { ClientsTableRow } from "@/app/clients/getClientsTableData";
import ShoppingList from "@/pdf/ShoppingList/ShoppingList";
import DriverOverview from "@/pdf/DriverOverview/DriverOverview";
import { Button } from "@mui/material";
import FreeFormTextInput from "@/components/DataInput/FreeFormTextInput";
import { DatePicker } from "@mui/x-date-pickers";

interface SharedModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: ClientsTableRow[];
    header: string;
    errorText: string | null;
    children: React.ReactElement;
    inputComponent?: React.ReactElement;
    showSelectedParcels: boolean;
}

const Centerer = styled.div`
    display: flex;
    justify-content: center;
`;

const Heading = styled.div`
    font-size: 1.2rem;
    margin: 0.3rem;
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

interface ModalButtonProps {
    data: ClientsTableRow[];
}

export const ShippingLabelsModalButton: React.FC<ModalButtonProps> = ({ data }) => {
    const parcelIds = data.map((parcel) => {
        return parcel.parcelId;
    });
    return <ShippingLabels text="Print" parcelIds={parcelIds} />;
};

export const ShoppingListModalButton: React.FC<ModalButtonProps> = ({ data }) => {
    return <ShoppingList text="Print" parcelId={data[0].parcelId} />;
};

interface DriverOverviewModalButton {
    data: ClientsTableRow[];
    date: Dayjs;
    driverName: string;
}

export const DriverOverviewModalButton: React.FC<DriverOverviewModalButton> = ({ data, date, driverName }) => {
    const parcelIds = data.map((parcel) => {
        return parcel.parcelId;
    });
    return (
        <DriverOverview
            driverName={driverName}
            date={date.toDate()}
            text="Print"
            parcelIds={parcelIds}
        />
    );
};

interface DriverOverviewInputProps {
    onDateChange: (newDate: Dayjs | null) => void;
    onDriverNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const DriverOverviewInput: React.FC<DriverOverviewInputProps> = ({
    onDateChange,
    onDriverNameChange,
}) => {
    return (
        <>
            <Heading>Delivery Information</Heading>
            <FreeFormTextInput onChange={onDriverNameChange} label="Driver's Name" />
            <DatePicker onChange={onDateChange} disablePast />
        </>
    );
};

const ActionsModal: React.FC<SharedModalProps> = (props) => {
    const [loadPdf, setLoadPdf] = useState(false);
    return (
        <Modal {...props} header={props.header} headerId="action-modal-header">
            <ModalInner>
                {props.inputComponent}
                {props.showSelectedParcels ? (
                    <>
                        <Heading>Parcels selected for printing:</Heading>

                        <div>
                            {props.data.map((parcel, index) => {
                                return (
                                    <StatusText key={index}>
                                        {parcel.collectionCentre}
                                        {parcel.fullName && ` - ${parcel.fullName}`}
                                        {parcel.collectionDatetime &&
                                            `\n @ ${dayjs(parcel.collectionDatetime!).format(
                                                "DD/MM/YYYY HH:mm"
                                            )}`}
                                    </StatusText>
                                );
                            })}
                        </div>
                    </>
                ) : (
                    <></>
                )}
                {props.errorText && <small>{props.errorText}</small>}
                <Centerer>
                    {loadPdf ? (
                        props.children
                    ) : (
                        <Button variant="contained" onClick={() => setLoadPdf(true)}>
                            Create PDF
                        </Button>
                    )}
                </Centerer>
            </ModalInner>
        </Modal>
    );
};

export default ActionsModal;
