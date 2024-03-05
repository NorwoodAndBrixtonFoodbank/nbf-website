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
        throw new DatabaseError("insert", "status event");
    }
};

interface Props {
    selected: number[];
    data: ParcelsTableRow[];
    statusAnchorElement: HTMLElement | null;
    setStatusAnchorElement: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
    modalError: string | null;
    setModalError: React.Dispatch<React.SetStateAction<string | null>>;
}

const Statuses: React.FC<Props> = ({
    selected,
    data,
    statusAnchorElement,
    setStatusAnchorElement,
    modalError,
    setModalError,
}) => {
    const [selectedStatus, setSelectedStatus] = useState<statusType | null>(null);
    const [statusModal, setStatusModal] = useState(false);

    const selectedData = Array.from(selected.map((index) => data[index]));

    const submitStatus = async (date: Dayjs): Promise<void> => {
        try {
            saveParcelStatus(
                selectedData.map((parcel: ParcelsTableRow) => {
                    return parcel.parcelId;
                }),
                selectedStatus!,
                null,
                date
            );
            setStatusModal(false);
            setModalError(null);
            window.location.reload();
        } catch (error: any) {
            setModalError(error.message);
        }
    };

    const onMenuItemClick = (status: statusType): (() => void) => {
        return () => {
            if (selectedData.length !== 0) {
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
                data={selectedData}
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
                        .map((status, index) => {
                            return (
                                <MenuItem key={index} onClick={onMenuItemClick(status)}>
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
