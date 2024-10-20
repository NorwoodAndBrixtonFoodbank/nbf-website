"use client";

import supabase from "@/supabaseClient";
import React, { useEffect, useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import dayjs, { Dayjs } from "dayjs";
import { ParcelsTableRow } from "@/app/parcels/parcelsTable/types";
import StatusesModal from "@/app/parcels/ActionBar/StatusesModal";
import { logErrorReturnLogId } from "@/logger/logger";
import { sendAuditLog } from "@/server/auditLog";
import { ParcelStatus } from "@/databaseUtils";
import { fetchParcelStatuses } from "@/app/parcels/parcelsTable/fetchParcelTableData";

export type StatusType = ParcelStatus[][number];

const nonMenuStatuses: StatusType[] = [
    "Packing Date Changed", //Generated when packing date is changed
    "Packing Slot Changed", //Generated when packing slot is changed
    "Out for Delivery", //Generated when driver overview pdf downloaded
    "Parcel Deleted", //Generated when parcel deleted
    "Shipping Labels Downloaded", //Generated when shipping labels pdf downloaded
    "Shopping List Downloaded", //Generated when shopping list pdf downloaded
];

const userFacingLabelForEmptyStatus = "No Status";

type SaveParcelStatusErrorType = "eventInsertionFailed";

export interface SaveParcelStatusError {
    type: SaveParcelStatusErrorType;
    logId: string;
}

export interface DeleteClientError {
    type: SaveParcelStatusErrorType;
    logId: string;
}

export type SaveParcelStatusResult = { error: null | SaveParcelStatusError };

export const saveParcelStatus = async (
    parcelIds: string[],
    statusName: StatusType,
    statusEventData?: string | null,
    action?: string,
    date?: Dayjs
): Promise<SaveParcelStatusResult> => {
    const timestamp = (date ?? dayjs()).toISOString();
    const eventsToInsert = parcelIds
        .map((parcelId: string) => {
            return {
                new_parcel_status: statusName,
                parcel_id: parcelId,
                event_data: statusEventData,
                timestamp,
            };
        })
        .flat();

    const auditLogs = eventsToInsert.map((eventToInsert) => ({
        action: action ?? "change parcel status",
        content: { eventToInsert },
        parcelId: eventToInsert.parcel_id,
    }));

    const { data, error } = await supabase
        .from("events")
        .insert(eventsToInsert)
        .select("event_id:primary_key, parcel_id");

    if (error || !data) {
        const logId = await logErrorReturnLogId("Error with insert: Status event", error);
        auditLogs.forEach(
            (auditLog) => void sendAuditLog({ ...auditLog, wasSuccess: false, logId })
        );
        return { error: { type: "eventInsertionFailed", logId: logId } };
    }

    auditLogs.forEach((auditLog) =>
        sendAuditLog({
            ...auditLog,
            eventId: data.find((event) => auditLog.parcelId === event.parcel_id)?.event_id,
            wasSuccess: true,
        })
    );

    return { error: null };
};

interface Props {
    fetchSelectedParcels: () => Promise<ParcelsTableRow[]>;
    statusAnchorElement: HTMLElement | null;
    setStatusAnchorElement: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
    setModalError: React.Dispatch<React.SetStateAction<string | null>>;
}

const getStatusErrorMessage = (statusError: SaveParcelStatusError): string => {
    switch (statusError.type) {
        case "eventInsertionFailed":
            return "Failed to save new parcel status.";
    }
};

export const getStatusErrorMessageWithLogId = (statusError: SaveParcelStatusError): string =>
    `${getStatusErrorMessage(statusError)} Log ID: ${statusError.logId}`;

const userFacingStatusString = (selectedStatus: StatusType | null): string =>
    selectedStatus && selectedStatus.length > 0 ? selectedStatus : userFacingLabelForEmptyStatus;

const Statuses: React.FC<Props> = ({
    fetchSelectedParcels,
    statusAnchorElement,
    setStatusAnchorElement,
    setModalError,
}) => {
    const [selectedParcels, setSelectedParcels] = useState<ParcelsTableRow[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<StatusType | null>(null);
    const [statusModal, setStatusModal] = useState(false);
    const [parcelStatuses, setParcelStatuses] = useState<ParcelStatus[] | null>(null);
    const [serverErrorMessage, setServerErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const getParcelStatuses = async (): Promise<void> => {
            const { data: parcelStatusesData, error: parcelStatusesError } =
                await fetchParcelStatuses();
            if (parcelStatusesError) {
                switch (parcelStatusesError.type) {
                    case "failedToFetchStatuses":
                        setModalError(
                            `Unable to retrieve statuses filter for parcels. Log ID: ${parcelStatusesError.logId}`
                        );
                        return;
                }
            }
            setParcelStatuses(parcelStatusesData);
        };
        void getParcelStatuses();
    }, [setModalError]);

    const submitStatus = async (date: Dayjs): Promise<void> => {
        setServerErrorMessage(null);
        if (selectedStatus === null) {
            setServerErrorMessage("Chosen status was not found.");
            return;
        }
        const { error } = await saveParcelStatus(
            selectedParcels.map((parcel: ParcelsTableRow) => {
                return parcel.parcelId;
            }),
            selectedStatus,
            null,
            undefined,
            date
        );
        if (error) {
            setServerErrorMessage(`${getStatusErrorMessage(error)} Log ID: ${error.logId}`);
        }
        if (!error) {
            setStatusModal(false);
        }
    };

    const onMenuItemClick = (status: StatusType): (() => void) => {
        return async () => {
            try {
                const fetchedParcels = await fetchSelectedParcels();
                setSelectedParcels(fetchedParcels);
                setServerErrorMessage(null);
                if (fetchedParcels.length > 0) {
                    setSelectedStatus(status);
                    setStatusModal(true);
                    setStatusAnchorElement(null);
                    setModalError(null);
                } else {
                    setModalError("Please select at least 1 row.");
                }
            } catch {
                setModalError("Database error when fetching selected parcels");
                return;
            }
        };
    };

    return (
        <>
            <StatusesModal
                isOpen={statusModal}
                onClose={() => {
                    setStatusModal(false);
                    setModalError(null);
                }}
                selectedParcels={selectedParcels}
                header={"Apply Status: " + userFacingStatusString(selectedStatus)}
                headerId="status-modal-header"
                onSubmit={submitStatus}
                errorText={serverErrorMessage}
            >
                <></>
            </StatusesModal>

            <Menu
                open={statusAnchorElement !== null}
                onClose={() => setStatusAnchorElement(null)}
                anchorEl={statusAnchorElement}
            >
                {parcelStatuses &&
                    parcelStatuses
                        .filter((status) => !nonMenuStatuses.includes(status))
                        .map((status) => {
                            return (
                                <MenuItem
                                    key={userFacingStatusString(status)}
                                    onClick={onMenuItemClick(status)}
                                >
                                    {userFacingStatusString(status)}
                                </MenuItem>
                            );
                        })}
            </Menu>
        </>
    );
};

export default Statuses;
