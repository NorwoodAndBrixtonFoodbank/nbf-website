"use client";

import React, { SetStateAction, useEffect, useState } from "react";
import styled from "styled-components";
import Modal from "@/components/Modal/Modal";
import dayjs, { Dayjs } from "dayjs";
import { ParcelsTableRow } from "@/app/parcels/getParcelsTableData";
import { Button, SelectChangeEvent } from "@mui/material";
import FreeFormTextInput from "@/components/DataInput/FreeFormTextInput";
import { DatePicker } from "@mui/x-date-pickers";
import DropdownListInput from "@/components/DataInput/DropdownListInput";
import supabase from "@/supabaseClient";
import { DatabaseError } from "@/app/errorClasses";
import { saveParcelStatus, statusType } from "./Statuses";

export type ActionType = 'pdfDownload' | 'deleteParcel';

interface ActionsModalProps extends React.ComponentProps<typeof Modal> {
    data: ParcelsTableRow[];
    errorText: string | null;
    inputComponent?: React.ReactElement;
    showSelectedParcels: boolean;
    actionType: ActionType;
    setSelectedRowIndices: React.Dispatch<SetStateAction<number[]>>
}

const Centerer = styled.div`
    display: flex;
    justify-content: center;
`;

const Heading = styled.div`
    font-size: 1.2rem;
    margin: 0.3rem;
`;

const Paragraph = styled.p`
    font-size: 1rem;
    margin: 0.3rem;
`;

const ModalInner = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
`;

const ListItem = styled.p<{ emphasised?: boolean }>`
    margin-left: 1rem;
    padding: 0.5rem 0;
    ${(props) =>
        props.emphasised &&
        `
            font-weight: 800;
        `}
`;

const ConfirmButtons = styled.div`
    display: flex;
    flex-direction: row;
    gap: 2rem;
    align-items: stretch;
`;

interface ShippingLabelsInputProps {
    onLabelQuantityChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ShippingLabelsInput: React.FC<ShippingLabelsInputProps> = ({
    onLabelQuantityChange,
}) => {
    return (
        <>
            <Heading>Shipping Labels</Heading>
            <FreeFormTextInput type="number" onChange={onLabelQuantityChange} label="Quantity" />
        </>
    );
};

interface ShoppingListsConfirmationProps {
    parcels: ParcelsTableRow[];
}

export const ShoppingListsConfirmation: React.FC<ShoppingListsConfirmationProps> = ({
    parcels,
}) => {
    const maxPostcodesToShow = 4;
    const statusToFind: statusType = "Shopping List Downloaded";

    const printedListPostcodes = parcels
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
            <DatePicker onChange={onDateChange} />
        </>
    );
};

const deleteParcels = async (parcels: ParcelsTableRow[]): Promise<void> => {
    await saveParcelStatus(
        parcels.map((parcel) => parcel.parcelId),
        "Request Deleted"
    );
    return;
}; //assume successful for now

const ActionsModal: React.FC<ActionsModalProps> = (props) => {
    const [loading, setLoading] = useState(false);
    const [loadPdf, setLoadPdf] = useState(false);
    const maxParcelsToShow = 5;

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
                        {props.actionType === "pdfDownload" ? (
                            <Heading> The PDF is ready to be downloaded. </Heading>
                        ) : (
                            <Heading>
                                {props.data.length === 1 ? "Parcel" : "Parcels"} deleted
                            </Heading>
                        )}

                        <Centerer>{props.children}</Centerer>
                    </>
                ) : (
                    <>
                        {props.actionType === "deleteParcel" && (
                            <Heading>
                                Are you sure you want to delete the selected parcel{" "}
                                {props.data.length === 1 ? "request" : "requests"}?
                            </Heading>
                        )}
                        {props.showSelectedParcels && (
                            <>
                                <Heading>
                                    {props.data.length === 1 ? "Parcel" : "Parcels"} selected:
                                </Heading>
                                {props.data.slice(0, maxParcelsToShow).map((parcel, index) => {
                                    return (
                                        <ListItem key={index}>
                                            {parcel.addressPostcode}
                                            {parcel.fullName && ` - ${parcel.fullName}`}
                                            {parcel.collectionDatetime &&
                                                `\n @ ${dayjs(parcel.collectionDatetime!).format(
                                                    "DD/MM/YYYY HH:mm"
                                                )}`}
                                        </ListItem>
                                    );
                                })}
                                {props.data.length > maxParcelsToShow ? (
                                    <ListItem emphasised>...</ListItem>
                                ) : (
                                    <></>
                                )}
                            </>
                        )}
                        {props.actionType === "pdfDownload" ? (
                            <Centerer>
                                <Button
                                    disabled={loading}
                                    variant="contained"
                                    onClick={() => setLoading(true)}
                                >
                                    {loading ? "Loading..." : "Create PDF"}
                                </Button>
                            </Centerer>
                        ) : (
                            <Centerer>
                                <ConfirmButtons>
                                    <Button
                                        disabled={loading}
                                        variant="contained"
                                        onClick={props.onClose}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        disabled={loading}
                                        variant="contained"
                                        onClick={() => {
                                            setLoading(true);
                                            deleteParcels(props.data);
                                            props.setSelectedRowIndices([]);
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </ConfirmButtons>
                            </Centerer>
                        )}
                    </>
                )}
            </ModalInner>
        </Modal>
    );
};

export default ActionsModal;
