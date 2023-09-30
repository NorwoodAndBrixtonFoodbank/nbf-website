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

const statuses = [
    "Request Denied",
    "No Status",
    "Pending More Info",
    "Called and Confirmed",
    "Called and No Response",
    "Ready to Dispatch",
    "Received by Centre",
    "Collection Failed",
    "Parcel Collected",
    "Delivered",
    "Delivery Failed",
    "Delivery Cancelled",
    "Fulfilled with Trussell Trust",
    "Shipping Label Printed",
] as const;

type statusType = (typeof statuses)[number];

const nonMenuStatuses: statusType[] = ["Shipping Label Printed"];

export const saveParcelStatus = async (
    parcelId: string,
    statusName: statusType,
    statusEventData?: string | null,
    date?: Dayjs | null
): Promise<void> => {
    const timestamp = (date ?? dayjs()).set("second", 0).toISOString();
    const toInsert = {
        event_name: statusName,
        parcel_id: parcelId,
        event_data: statusEventData,
        timestamp,
    };

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
        // TODO VFB-53: refactor this so it shares with saveParcelStatus()
        const toInsert = selectedData
            .map((parcel: ParcelsTableRow) => {
                const event_name = selectedStatus!;
                const timestamp = date.set("second", 0).toISOString();
                return {
                    event_name,
                    parcel_id: parcel.parcelId,
                    timestamp,
                };
            })
            .flat();

        const { error } = await supabase.from("events").insert(toInsert);

        if (error) {
            setModalError(error.message);
        } else {
            setStatusModal(false);
            setModalError(null);
            window.location.reload();
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
                    {statuses
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
