"use client";

import supabase, { Schema } from "@/supabase";
import React, { useState } from "react";
import { styled } from "styled-components";
import Button from "@mui/material/Button/Button";
import Menu from "@mui/material/Menu/Menu";
import MenuList from "@mui/material/MenuList/MenuList";
import MenuItem from "@mui/material/MenuItem/MenuItem";
import ListItemText from "@mui/material/ListItemText/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon/ListItemIcon";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import Modal from "@/components/Modal/Modal";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import Icon from "@/components/Icons/Icon";

type Props = {
    selected: number[];
    data: Schema["parcels"][];
};

export const statuses = [
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

const OuterDiv = styled.div`
    display: flex;
    padding: 1rem;
    gap: 1rem;
    border-radius: 0.5rem;
    background-color: ${(props) => props.theme.surfaceBackgroundColor};
    margin: 1rem;
`;

const Spacer = styled.div`
    flex-grow: 1;
    display: flex;
`;

const ActionBar: React.FC<Props> = ({ selected, data }) => {
    const selectedData = Array.from(selected.map((index) => data[index]));

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [selectedStatuses, setSelectedStatuses] = useState<boolean[]>(
        Array.from(statuses.map(() => false))
    );

    const [modal, setModal] = useState(false);

    const statusesToApply: string[] = selectedStatuses
        .map((status, index) => {
            if (status) {
                return statuses[index];
            }
            return null;
        })
        .filter((status) => status !== null) as string[];

    return (
        <>
            <StatusModal
                isOpen={modal}
                onClose={() => setModal(false)}
                data={selectedData}
                statuses={statusesToApply}
            />
            <Menu open={anchorEl !== null} onClose={() => setAnchorEl(null)} anchorEl={anchorEl}>
                <MenuList id="status-menu">
                    {statuses.map((status, index) => {
                        return (
                            <MenuItem
                                key={index}
                                onClick={() => {
                                    selectedStatuses[index] = !selectedStatuses[index];
                                    setSelectedStatuses([...selectedStatuses]);
                                    console.log("hi");
                                }}
                            >
                                <ListItemIcon>
                                    {selectedStatuses[index] ? <Icon icon={faCheck} /> : <></>}
                                </ListItemIcon>
                                <ListItemText primary={status} />
                            </MenuItem>
                        );
                    })}
                </MenuList>
            </Menu>
            <OuterDiv>
                <Button
                    variant="contained"
                    onClick={(event) => setAnchorEl(event.currentTarget)}
                    type="button"
                    id="status-button"
                >
                    Statuses
                </Button>
                <Button variant="contained">Actions</Button>
                <Spacer />
                <Button
                    type="button"
                    variant="contained"
                    onClick={() => setModal(statusesToApply.length > 0)}
                    id="status-modal-button"
                >
                    Apply {statusesToApply.length} status{statusesToApply.length === 1 ? "" : "es"}{" "}
                    to {selectedData.length} item{selectedData.length === 1 ? "" : "s"}
                </Button>
            </OuterDiv>
        </>
    );
};

type StatusModalProps = {
    isOpen: boolean;
    onClose: () => void;
    data: Schema["parcels"][];
    statuses: string[];
};

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
    padding-top: 1rem;
    padding-bottom: 1rem;
    &:last-child {
        border-bottom: 1px solid darkgrey;
        padding-bottom: 1rem;
    }
`;

const StatusModal: React.FC<StatusModalProps> = (props) => {
    const [date, setDate] = useState(dayjs(Date()));
    const [error, setError] = useState<string | null>(null);

    const onClick = async (): Promise<void> => {
        const toInsert = props.data
            .map((parcel) => {
                return props.statuses.map((status) => {
                    const event_name = status;
                    const parcel_id = parcel.primary_key;
                    const timestamp = date.set("second", 0).toISOString();
                    return {
                        event_name,
                        parcel_id,
                        timestamp,
                    };
                });
            })
            .flat();

        const response = await supabase.from("events").insert(toInsert);

        if (response.error) {
            setError(response.error.message);
        } else {
            props.onClose();
        }
    };

    return (
        <Modal {...props} header="Apply Status" headerId="status-modal-header">
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
                    {props.statuses.map((status) => {
                        return (
                            <StatusText key={status}>
                                {status} to {props.data.length} item
                                {props.data.length === 1 ? "" : "s"}
                            </StatusText>
                        );
                    })}
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
                {error ? <small>{error}</small> : <></>}
                <Button type="button" variant="contained" onClick={onClick}>
                    Submit
                </Button>
            </ModalInner>
        </Modal>
    );
};

export default ActionBar;
