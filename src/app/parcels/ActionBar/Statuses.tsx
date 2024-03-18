"use client";

import supabase from "@/supabaseClient";
import React, { useState } from "react";
import Menu from "@mui/material/Menu/Menu";
import MenuList from "@mui/material/MenuList/MenuList";
import MenuItem from "@mui/material/MenuItem/MenuItem";
import dayjs, { Dayjs } from "dayjs";
import { ParcelsTableRow } from "@/app/parcels/getParcelsTableData";
import StatusesBarModal from "@/app/parcels/ActionBar/StatusesModal";
import { DatabaseError } from "@/app/errorClasses";
import { logErrorReturnLogId } from "@/logger/logger";

export const statusNamesInWorkflowOrder = [
    "No Status",
    "Request Denied",
    "Pending More Info",
    "Called and Confirmed",
    "Called and No Response",
    "Shopping List Downloaded",
    "Ready to Dispatch",
    "Received by Centre",
    "Collection Failed",
    "Parcel Collected",
    "Shipping Labels Downloaded",
    "Out for Delivery",
    "Delivered",
    "Delivery Failed",
    "Delivery Cancelled",
    "Fulfilled with Trussell Trust",
    "Request Deleted",
];

export type statusType = (typeof statusNamesInWorkflowOrder)[number];

const nonMenuStatuses: statusType[] = [
    "Shipping Labels Downloaded",
    "Shopping List Downloaded",
    "Out for Delivery",
    "Request Deleted",
];

export const saveParcelStatus = async (
    parcelIds: string[],
    statusName: statusType,
    statusEventData?: string | null,
    date?: Dayjs | null
): Promise<void> => {
    const timestamp = (date ?? dayjs()).set("second", 0).toISOString();
    const toInsert = parcelIds
        .map((parcelId: string) => {
            return {
                event_name: statusName,
                parcel_id: parcelId,
                event_data: statusEventData,
                timestamp,
            };
        })
        .flat();

    const { error } = await supabase.from("events").insert(toInsert);
    if (error) {
        const response = logErrorReturnLogId("Error with insert: Status event", error);
        response.then((errorId) => {
            throw new DatabaseError("insert", "status event", errorId);
        });
    }
};

interface Props {
    selectedParcels: ParcelsTableRow[];
    statusAnchorElement: HTMLElement | null;
    setStatusAnchorElement: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
    modalError: string | null;
    setModalError: React.Dispatch<React.SetStateAction<string | null>>;
    willSaveParcelStatus: () => void;
    hasSavedParcelStatus: () => void;
}

const Statuses: React.FC<Props> = ({
    selectedParcels,
    statusAnchorElement,
    setStatusAnchorElement,
    modalError,
    setModalError,
    willSaveParcelStatus,
    hasSavedParcelStatus,
}) => {
    const [selectedStatus, setSelectedStatus] = useState<statusType | null>(null);
    const [statusModal, setStatusModal] = useState(false);

    const submitStatus = async (date: Dayjs): Promise<void> => {
        willSaveParcelStatus();
        try {
            await saveParcelStatus(
                selectedParcels.map((parcel: ParcelsTableRow) => {
                    return parcel.parcelId;
                }),
                selectedStatus!,
                null,
                date
            );
            setStatusModal(false);
            setModalError(null);
        } catch (error: any) {
            setModalError(error.message);
        }
        hasSavedParcelStatus();
    };

    const onMenuItemClick = (status: statusType): (() => void) => {
        return () => {
            if (selectedParcels.length !== 0) {
                setSelectedStatus(status);
                setStatusModal(true);
                setStatusAnchorElement(null);
                setModalError(null);
            } else {
                setModalError("Please select at least 1 row.");
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
                errorText={modalError}
            >
                <></>
            </StatusesBarModal>

            <Menu
                open={statusAnchorElement !== null}
                onClose={() => setStatusAnchorElement(null)}
                anchorEl={statusAnchorElement}
            >
                <MenuList id="status-menu">
                    {statusNamesInWorkflowOrder
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
