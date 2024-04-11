"use client";

import React, { useEffect, useState } from "react";
import {
    Centerer,
    Heading,
    Paragraph,
    maxParcelsToShow,
    ActionModalProps,
    ModalInner,
} from "./common";
import { SelectChangeEvent } from "@mui/material";
import SelectedParcelsOverview from "../SelectedParcelsOverview";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";
import supabase from "@/supabaseClient";
import { logErrorReturnLogId } from "@/logger/logger";
import DropdownListInput from "@/components/DataInput/DropdownListInput";
import { DatabaseError } from "@/app/errorClasses";
import DayOverview from "@/pdf/DayOverview/DayOverview";
import { getStatusErrorMessageWithLogId } from "../Statuses";
import Modal from "@/components/Modal/Modal";
import { ErrorSecondaryText } from "@/app/errorStylingandMessages";

interface DayOverviewInputProps {
    onDateChange: (newDate: Dayjs | null) => void;
    onCollectionCentreChange: (event: SelectChangeEvent) => void;
    setCollectionCentre: React.Dispatch<React.SetStateAction<string>>;
}

const DayOverviewInput: React.FC<DayOverviewInputProps> = ({
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
                const logId = await logErrorReturnLogId(
                    "Error with fetch: Collection centres",
                    error
                );
                throw new DatabaseError("fetch", "collection centres", logId); //to do: return not throw
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
                    selectLabelId="collection-centre-select-label"
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

interface DayOverviewModalButtonProps {
    collectionCentre: string;
    date: Dayjs;
    onDoAction: () => void;
}

const DayOverviewModalButton: React.FC<DayOverviewModalButtonProps> = ({
    collectionCentre,
    date,
    onDoAction,
}) => {
    return (
        <DayOverview
            text="Download"
            date={date.toDate()}
            collectionCentreKey={collectionCentre}
            onClick={onDoAction}
        />
    );
};

const DayOverviewModal: React.FC<ActionModalProps> = (props) => {
    const [actionCompleted, setActionCompleted] = useState(false);
    const [serverErrorMessage, setServerErrorMessage] = useState<string | null>(null);
    const updateParcelsStatuses = async (): Promise<void> => {
        const { error } = await props.updateParcelStatuses(props.selectedParcels, props.newStatus);
        if (error) {
            setServerErrorMessage(getStatusErrorMessageWithLogId(error));
        }
    };

    const [date, setDate] = useState(dayjs());
    const [collectionCentre, setCollectionCentre] = useState("");

    const onCollectionCentreChange = (event: SelectChangeEvent): void => {
        setCollectionCentre(event.target.value);
    };

    const onDateChange = (newDate: Dayjs | null): void => {
        setDate(newDate!);
    };

    const onClose = (): void => {
        props.onClose();
        setDate(dayjs());
        setCollectionCentre("");
        setServerErrorMessage(null);
    };

    const onDoAction = (): void => {
        updateParcelsStatuses();
        setActionCompleted(true);
    };

    return (
        <Modal {...props} onClose={onClose}>
            <ModalInner>
                {actionCompleted ? (
                    serverErrorMessage ? (
                        <ErrorSecondaryText>{serverErrorMessage}</ErrorSecondaryText>
                    ) : (
                        <Paragraph>Day Overview Created</Paragraph>
                    )
                ) : (
                    <>
                        <DayOverviewInput
                            onDateChange={onDateChange}
                            onCollectionCentreChange={onCollectionCentreChange}
                            setCollectionCentre={setCollectionCentre}
                        />
                        <SelectedParcelsOverview
                            parcels={props.selectedParcels}
                            maxParcelsToShow={maxParcelsToShow}
                        />
                        <Centerer>
                            <DayOverviewModalButton
                                collectionCentre={collectionCentre}
                                date={date}
                                onDoAction={onDoAction}
                            />
                        </Centerer>
                    </>
                )}
            </ModalInner>
        </Modal>
    );
};

export default DayOverviewModal;
