"use client";

import React, { useEffect, useState } from "react";
import GeneralActionModal, { Heading, ActionModalProps } from "./GeneralActionModal";
import { SelectChangeEvent } from "@mui/material";
import { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";
import supabase from "@/supabaseClient";
import { logErrorReturnLogId } from "@/logger/logger";
import DropdownListInput from "@/components/DataInput/DropdownListInput";
import DayOverviewPdfButton, { DayOverviewPdfError } from "@/pdf/DayOverview/DayOverviewPdfButton";
import { getStatusErrorMessageWithLogId } from "../Statuses";
import { sendAuditLog } from "@/server/auditLog";

interface DayOverviewInputProps {
    onDateChange: (newDate: Dayjs | null) => void;
    onCollectionCentreChange: (event: SelectChangeEvent) => void;
    setCollectionCentre: (collectionCentreName: string) => void;
    setFetchErrorMessage: (fetchErrorMessage: string) => void;
    setDateValid: () => void;
    setDateInvalid: () => void;
}

const DayOverviewInput: React.FC<DayOverviewInputProps> = ({
    onDateChange,
    onCollectionCentreChange,
    setCollectionCentre,
    setFetchErrorMessage,
    setDateValid,
    setDateInvalid,
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
                setFetchErrorMessage(
                    `Unable to fetch collection centres. Please try again later. Log ID: ${logId}`
                );
                return;
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
            <DatePicker
                onChange={onDateChange}
                onError={(error) => {
                    if (error) {
                        setDateInvalid();
                    } else {
                        setDateValid();
                    }
                }}
            />
        </>
    );
};

const getPdfErrorMessage = (error: DayOverviewPdfError): string => {
    let errorMessage: string;
    switch (error.type) {
        case "collectionCentreFetchFailed":
            errorMessage = "Failed to fetch collection centre.";
            break;
        case "noMatchingCollectionCentre":
            errorMessage = "No matching collection centre found.";
            break;
        case "parcelFetchFailed":
            errorMessage = "Failed to fetch parcels for this day and collection centre.";
            break;
    }
    return `${errorMessage} LogId: ${error.logId}`;
};

const DayOverviewModal: React.FC<ActionModalProps> = (props) => {
    const [actionCompleted, setActionCompleted] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [date, setDate] = useState<Date>(new Date());
    const [collectionCentre, setCollectionCentre] = useState<string | null>(null);
    const [isDateValid, setIsDateValid] = useState(false);

    const isInputValid = !errorMessage && collectionCentre !== null && isDateValid;

    const onCollectionCentreChange = (event: SelectChangeEvent): void => {
        setCollectionCentre(event.target.value);
    };

    const onDateChange = (newDate: Dayjs | null): void => {
        setDate(newDate!.toDate());
    };

    const onClose = (): void => {
        props.onClose();
        setDate(new Date());
        setCollectionCentre("");
        setErrorMessage(null);
    };

    const onPdfCreationCompleted = async (): Promise<void> => {
        const { error } = await props.updateParcelStatuses(props.selectedParcels, props.newStatus);
        if (error) {
            setErrorMessage(getStatusErrorMessageWithLogId(error));
        }
        setActionCompleted(true);
        void sendAuditLog({
            action: "create day overview pdf",
            wasSuccess: true,
            collectionCentreId: collectionCentre ?? undefined,
            content: { date: date.toString() },
        });
    };

    const onPdfCreationFailed = (pdfError: DayOverviewPdfError): void => {
        setErrorMessage(getPdfErrorMessage(pdfError));
        setActionCompleted(true);
        void sendAuditLog({
            action: "create day overview pdf",
            wasSuccess: false,
            collectionCentreId: collectionCentre ?? undefined,
            content: { date: date.toString() },
            logId: pdfError.logId,
        });
    };

    return (
        <GeneralActionModal
            {...props}
            onClose={onClose}
            errorMessage={errorMessage}
            successMessage="Day Overview Created"
            actionCompleted={actionCompleted}
            actionButton={
                <DayOverviewPdfButton
                    date={date}
                    collectionCentreKey={collectionCentre}
                    onPdfCreationCompleted={onPdfCreationCompleted}
                    onPdfCreationFailed={onPdfCreationFailed}
                    disabled={!isInputValid}
                />
            }
            contentAboveButton={
                <DayOverviewInput
                    onDateChange={onDateChange}
                    onCollectionCentreChange={onCollectionCentreChange}
                    setCollectionCentre={setCollectionCentre}
                    setFetchErrorMessage={setErrorMessage}
                    setDateInvalid={() => setIsDateValid(false)}
                    setDateValid={() => setIsDateValid(true)}
                />
            }
        />
    );
};

export default DayOverviewModal;
