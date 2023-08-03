"use client";

import supabase, { Schema } from "@/supabase";
import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import Button from "@mui/material/Button/Button";
import Menu from "@mui/material/Menu/Menu";
import MenuList from "@mui/material/MenuList/MenuList";
import MenuItem from "@mui/material/MenuItem/MenuItem";
import Modal from "@/components/Modal/Modal";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";

interface Props {
    selected: number[];
    data: Schema["parcels"][];
}

const statuses = [
    "Request Denied",
    // probably shouldn't be a status (?)
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
];

const actions = [
    "Generate Map",
    "Print Day Overview",
    "Print Shopping List",
    "Print Shipping Label",
    "Print Driver Overview",
    "Delete Request",
];

const OuterDiv = styled.div`
    display: flex;
    padding: 1rem;
    gap: 1rem;
    border-radius: 0.5rem;
    background-color: ${(props) => props.theme.surfaceBackgroundColor};
    margin: 1rem;
`;

const ActionBar: React.FC<Props> = ({ selected, data }) => {
    const selectedData = Array.from(selected.map((index) => data[index]));

    const [statusAnchorEl, setStatusAnchorEl] = React.useState<null | HTMLElement>(null);
    const [actionAnchorEl, setActionAnchorEl] = React.useState<null | HTMLElement>(null);
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
    const [selectedAction, setSelectedAction] = useState<string | null>(null);

    const [statusModal, setStatusModal] = useState(false);
    const [actionModal, setActionModal] = useState(false);

    const [modalError, setModalError] = useState<string | null>(null);

    const submitStatus = async (date: Dayjs): Promise<void> => {
        const toInsert = selectedData
            .map((parcel) => {
                const event_name = selectedStatus!;
                const parcel_id = parcel.primary_key;
                const timestamp = date.set("second", 0).toISOString();
                return {
                    event_name,
                    parcel_id,
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
        }
    };

    const submitAction = async (): Promise<void> => {};

    return (
        <>
            <SharedModal
                isOpen={statusModal}
                onClose={() => {
                    setStatusModal(false);
                    setModalError(null);
                }}
                data={selectedData}
                status={selectedStatus}
                header="Apply Status"
                headerId="status-modal-header"
                onSubmit={submitStatus}
                errorText={modalError}
            />
            <SharedModal
                isOpen={actionModal}
                onClose={() => {
                    setActionModal(false);
                    setModalError(null);
                }}
                data={selectedData}
                status={selectedAction}
                header="Perform Action"
                headerId="action-modal-header"
                onSubmit={submitAction}
                errorText={modalError}
            />
            <Menu
                open={statusAnchorEl !== null}
                onClose={() => setStatusAnchorEl(null)}
                anchorEl={statusAnchorEl}
            >
                <MenuList id="status-menu">
                    {statuses.map((status, index) => {
                        return (
                            <MenuItem
                                key={index}
                                onClick={() => {
                                    setSelectedStatus(status);
                                    setStatusModal(true);
                                    setStatusAnchorEl(null);
                                }}
                            >
                                {status}
                            </MenuItem>
                        );
                    })}
                </MenuList>
            </Menu>
            <Menu
                open={actionAnchorEl !== null}
                onClose={() => setActionAnchorEl(null)}
                anchorEl={actionAnchorEl}
            >
                <MenuList id="action-menu">
                    {actions.map((action, index) => {
                        return (
                            <MenuItem
                                key={index}
                                onClick={() => {
                                    setSelectedAction(action);
                                    setActionModal(true);
                                    setActionAnchorEl(null);
                                }}
                            >
                                {action}
                            </MenuItem>
                        );
                    })}
                </MenuList>
            </Menu>
            <OuterDiv>
                <Button
                    variant="contained"
                    onClick={(event) => setStatusAnchorEl(event.currentTarget)}
                    type="button"
                    id="status-button"
                >
                    Statuses
                </Button>
                <Button
                    variant="contained"
                    onClick={(event) => setActionAnchorEl(event.currentTarget)}
                    type="button"
                    id="action-button"
                >
                    Actions
                </Button>
            </OuterDiv>
        </>
    );
};

interface SharedModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: Schema["parcels"][];
    status: string | null;
    onSubmit: (date: Dayjs) => void;
    header: string;
    headerId: string;
    errorText: string | null;
}

const Row = styled.div`
    display: flex;
    gap: 1rem;
    align-items: center;
`;

const ModalInner = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
`;

const StatusText = styled.p`
    margin-left: 1rem;
    border-top: 1px solid darkgrey;
    padding: 1rem 0;
    &:last-child {
        border-bottom: 1px solid darkgrey;
    }
`;

const SharedModal: React.FC<SharedModalProps> = (props) => {
    const [date, setDate] = useState(dayjs(Date()));

    useEffect(() => {
        setDate(dayjs(Date()));
    }, [props.isOpen]);

    return (
        <Modal {...props} header={props.header} headerId={props.headerId}>
            <ModalInner>
                <Row>
                    <p>Date: </p>
                    <DatePicker
                        value={date}
                        defaultValue={date}
                        onChange={(newDate) =>
                            setDate((date) =>
                                date
                                    .set("year", newDate?.year() ?? date.year())
                                    .set("month", newDate?.month() ?? date.month())
                                    .set("day", newDate?.day() ?? date.day())
                            )
                        }
                        disableFuture
                    />
                </Row>
                <Row>
                    <p>Time: </p>
                    <TimePicker
                        value={date}
                        onChange={(newDate) =>
                            setDate((date) =>
                                date
                                    .set("hour", newDate?.hour() ?? date.hour())
                                    .set("minute", newDate?.minute() ?? date.minute())
                            )
                        }
                        disableFuture
                    />
                </Row>
                <p>Applying:</p>
                <div>
                    <StatusText key={props.status}>{props.status}</StatusText>
                </div>
                <p>To</p>
                <div>
                    {props.data.map((parcel, index) => {
                        return (
                            <StatusText key={index}>
                                {parcel.collection_centre}: (
                                {parcel.collection_datetime ? (
                                    new Date(parcel.collection_datetime).toLocaleString()
                                ) : (
                                    <></>
                                )}
                                )
                            </StatusText>
                        );
                    })}
                </div>
                {props.errorText ? <small>{props.errorText}</small> : <></>}
                <Button type="button" variant="contained" onClick={() => props.onSubmit(date)}>
                    Submit
                </Button>
            </ModalInner>
        </Modal>
    );
};

export default ActionBar;
