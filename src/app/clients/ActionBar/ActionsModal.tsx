"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Modal from "@/components/Modal/Modal";
import dayjs, { Dayjs } from "dayjs";
import { ClientsTableRow } from "@/app/clients/getClientsTableData";
import { Button } from "@mui/material";
import FreeFormTextInput from "@/components/DataInput/FreeFormTextInput";
import { DatePicker } from "@mui/x-date-pickers";

interface ActionsModalProps extends React.ComponentProps<typeof Modal> {
    data: ClientsTableRow[];
    errorText: string | null;
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
    border-top: 1px solid ${(props) => props.theme.main.lighterForeground[2]};
    padding: 1rem 0;
    &:last-child {
        border-bottom: 1px solid ${(props) => props.theme.main.lighterForeground[2]};
    }
`;

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

const ActionsModal: React.FC<ActionsModalProps> = (props) => {
    const [loadPdf, setLoadPdf] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (loading && !loadPdf) {
            setLoadPdf(true);
            setLoading(false);
        }
    }, [loading, loadPdf]);

    return (
        <Modal {...props}>
            <ModalInner>
                {!loadPdf && props.inputComponent}
                {props.errorText && <small>{props.errorText}</small>}
                {loadPdf ? (
                    <>
                        <Heading> The PDF is ready to be downloaded. </Heading>
                        <Centerer>{props.children}</Centerer>
                    </>
                ) : (
                    <>
                        <Heading>Parcels selected for download:</Heading>
                        {props.showSelectedParcels && (
                            <>
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
                            </>
                        )}
                        <Centerer>
                            <Button
                                disabled={loading}
                                variant="contained"
                                onClick={() => setLoading(true)}
                            >
                                {loading ? "Loading..." : "Create PDF"}
                            </Button>
                        </Centerer>
                    </>
                )}
            </ModalInner>
        </Modal>
    );
};

export default ActionsModal;
