"use client";

import supabase from "@/supabaseClient";
import React, { useState } from "react";
import Menu from "@mui/material/Menu/Menu";
import MenuList from "@mui/material/MenuList/MenuList";
import MenuItem from "@mui/material/MenuItem/MenuItem";
import dayjs, { Dayjs } from "dayjs";
import { ParcelsTableRow } from "@/app/parcels/getParcelsTableData";
import StatusesBarModal from "@/app/parcels/ActionBar/StatusesModal";
import { logErrorReturnLogId } from "@/logger/logger";
import { sendAuditLog } from "@/server/auditLog";

export const statusNames = [
    "No Status",
    "Request Denied",
    "Pending More Info",
    "Called and Confirmed",
    "Called and No Response",
    "Shopping List Downloaded",
    "Day Overview Downloaded",
    "Ready to Dispatch",
    "Received by Centre",
    "Collection Failed",
    "Parcel Collected",
    "Shipping Labels Downloaded",
    "Driver Overview Downloaded",
    "Map Generated",
    "Out for Delivery",
    "Delivered",
    "Delivery Failed",
    "Delivery Cancelled",
    "Fulfilled with Trussell Trust",
    "Request Deleted",
] as const;

export type StatusType = (typeof statusNames)[number];

const nonMenuStatuses: StatusType[] = [
    "Shipping Labels Downloaded",
    "Shopping List Downloaded",
    "Out for Delivery",
    "Request Deleted",
];

type SaveParcelStatusErrorType = "eventInsertionFailed";

export interface SaveParcelStatusError {
    type: SaveParcelStatusErrorType;
    logId: string;
}

export type SaveParcelStatusReturnType = { error: null | SaveParcelStatusError };

export const saveParcelStatus = async (
    parcelIds: string[],
    statusName: StatusType,
    statusEventData?: string | null,
    date?: Dayjs | null
): Promise<SaveParcelStatusReturnType> => {
    const timestamp = (date ?? dayjs()).set("second", 0).toISOString();
    const eventsToInsert = parcelIds
        .map((parcelId: string) => {
            return {
                event_name: statusName,
                parcel_id: parcelId,
                event_data: statusEventData,
                timestamp,
            };
        })
        .flat();

    const auditLogs = eventsToInsert.map((eventToInsert) => ({
        action: "change parcel status",
        content: { eventToInsert },
        parcelId: eventToInsert.parcel_id,
    }));

    const { data, error } = await supabase
        .from("event")
        .insert(eventsToInsert)
        .select("event_id:primary_key, parcel_id");

    if (error || !data) {
        const logId = await logErrorReturnLogId("Error with insert: Status event", error);
        auditLogs.forEach(
            async (auditLog) => await sendAuditLog({ ...auditLog, wasSuccess: false, logId })
        );
        return { error: { type: "eventInsertionFailed", logId: logId } };
    }

    auditLogs.forEach(
        async (auditLog) =>
            await sendAuditLog({
                ...auditLog,
                eventId: data.find((event) => auditLog.parcelId === event.parcel_id)?.event_id,
                wasSuccess: true,
            })
    );

    return { error: null };
};

interface Props {
    fetchParcelsByIds: (checkedParceldIds: string[]) => Promise<ParcelsTableRow[]>;
    statusAnchorElement: HTMLElement | null;
    setStatusAnchorElement: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
    setModalError: React.Dispatch<React.SetStateAction<string | null>>;
    willSaveParcelStatus: () => void;
    hasSavedParcelStatus: () => void;
    parcelIds: string[];
}

const getStatusErrorMessage = (statusError: SaveParcelStatusError): string => {
    switch (statusError.type) {
        case "eventInsertionFailed":
            return "Failed to save new parcel status.";
    }
};

export const getStatusErrorMessageWithLogId = (statusError: SaveParcelStatusError): string =>
    `${getStatusErrorMessage(statusError)} Log ID: ${statusError.logId}`;

const Statuses: React.FC<Props> = ({
    fetchParcelsByIds,
    statusAnchorElement,
    setStatusAnchorElement,
    setModalError,
    willSaveParcelStatus,
    hasSavedParcelStatus,
    parcelIds,
}) => {
    const [selectedParcels, setSelectedParcels] = useState<ParcelsTableRow[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<StatusType | null>(null);
    const [statusModal, setStatusModal] = useState(false);
    const [serverErrorMessage, setServerErrorMessage] = useState<string | null>(null);

    const submitStatus = async (date: Dayjs): Promise<void> => {
        willSaveParcelStatus();
        setServerErrorMessage(null);
        const { error } = await saveParcelStatus(
            selectedParcels.map((parcel: ParcelsTableRow) => {
                return parcel.parcelId;
            }),
            selectedStatus!,
            null,
            date
        );
        if (error) {
            setServerErrorMessage(`${getStatusErrorMessage(error)} Log ID: ${error.logId}`);
        }
        hasSavedParcelStatus();
    };

    const onMenuItemClick = (status: StatusType): (() => void) => {
        return async () => {
            try {
                const fetchedParcels = await fetchParcelsByIds(parcelIds);
                setSelectedParcels(fetchedParcels);
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
            <StatusesBarModal
                isOpen={statusModal}
                onClose={() => {
                    setStatusModal(false);
                    setModalError(null);
                }}
                selectedParcels={selectedParcels}
                header={selectedStatus ?? "Apply Status"}
                headerId="status-modal-header"
                onSubmit={submitStatus}
                errorText={serverErrorMessage}
            >
                <></>
            </StatusesBarModal>

            <Menu
                open={statusAnchorElement !== null}
                onClose={() => setStatusAnchorElement(null)}
                anchorEl={statusAnchorElement}
            >
                <MenuList id="status-menu">
                    {statusNames
                        .filter((status) => !nonMenuStatuses.includes(status))
                        .map((status) => {
                            return (
                                <MenuItem key={status} onClick={onMenuItemClick(status)}>
                                    {status}
                                </MenuItem>
                            );
                        })}
                </MenuList>
            </Menu>
        </>
    );
};

export default Statuses;
