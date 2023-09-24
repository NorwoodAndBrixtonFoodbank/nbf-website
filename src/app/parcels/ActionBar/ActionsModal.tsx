"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Modal from "@/components/Modal/Modal";
import dayjs, { Dayjs } from "dayjs";
import { ParcelsTableRow } from "@/app/parcels/getParcelsTableData";
import { Button, SelectChangeEvent } from "@mui/material";
import FreeFormTextInput from "@/components/DataInput/FreeFormTextInput";
import { DatePicker, DesktopDatePicker } from "@mui/x-date-pickers";
import DropdownListInput from "@/components/DataInput/DropdownListInput";
import supabase from "@/supabaseClient";
import { DatabaseError } from "@/app/errorClasses";

interface ActionsModalProps extends React.ComponentProps<typeof Modal> {
    data: ParcelsTableRow[];
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

interface DayOverviewInputProps {
    onDateChange: (newDate: Dayjs | null) => void;
    onCollectionCentreChange: (event: SelectChangeEvent) => void;
    setCollectionCentre: React.Dispatch<React.SetStateAction<string>>;
}

export const DayOverviewInput: React.FC<DayOverviewInputProps> = ({
    onDateChange,
    onCollectionCentreChange,
    setCollectionCentre,
}) => {
    const [collectionCentres, setCollectionCentres] = useState<[string, string][] | null>(null);

    useEffect(() => {
        (async () => {
            const { data, error } = await supabase
                .from("collection_centres")
                .select("primary_key, name");
            if (error) {
                throw new DatabaseError("fetch", "collection centres");
            }

            const transformedData: [string, string][] = data.map((item) => [
                item.name,
                item.primary_key,
            ]);
            setCollectionCentres(transformedData);
            setCollectionCentre(transformedData[0][1]);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Heading>Location</Heading>
            {collectionCentres && (
                <DropdownListInput
                    onChange={onCollectionCentreChange}
                    labelsAndValues={collectionCentres}
                    defaultValue={collectionCentres[0][1]}
                />
            )}
            <Heading>Date</Heading>
            <DesktopDatePicker onChange={onDateChange} />
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
                        {props.showSelectedParcels && (
                            <>
                                <Heading>Parcels selected for download:</Heading>
                                {props.data.map((parcel, index) => {
                                    return (
                                        <StatusText key={index}>
                                            {parcel.deliveryCollection.collectionCentreAcronym}
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
