import styled from "styled-components";
import { Dialog } from "@mui/material";
import React from "react";
import { CalendarEvent } from "@/components/Calendar/Calendar";
import Modal from "@/components/Modal/Modal";

const StyledDialog = styled(Dialog)`
    & .MuiPaper-root {
        width: min(50%, 600px);
        border-radius: 2rem;
        padding: 1.5rem;
        text-align: center;
    }
`;

const StyledCloseButton = styled.button`
    position: absolute;
    right: 20px;
    top: 20px;
`;

const ModalInner = styled.div`
    display: flex;
    flex-direction: column;
    row-gap: 1rem;
`;

const dateTimeFormatOptions: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
};

const dateFormatOptions: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
};

const EventModal: React.FC<{
    eventClick: CalendarEvent | null;
    setEventClick: (data: CalendarEvent | null) => void;
}> = ({ eventClick, setEventClick }) => {
    if (!eventClick) {
        return <></>;
    }

    const startDate = new Date(eventClick.start).toLocaleString(
        "en-GB",
        eventClick.allDay ? dateFormatOptions : dateTimeFormatOptions
    );

    const endDate = new Date(eventClick.end).toLocaleString(
        "en-GB",
        eventClick.allDay ? dateFormatOptions : dateTimeFormatOptions
    );

    return (
        <Modal header={eventClick.title} isOpen={true} onClose={() => setEventClick(null)}>
            <p>Start: {startDate}</p>
            <p>End: {endDate}</p>
            {eventClick.description ? <p>Description: {eventClick.description}</p> : <></>}
        </Modal>
    );
};

export default EventModal;
