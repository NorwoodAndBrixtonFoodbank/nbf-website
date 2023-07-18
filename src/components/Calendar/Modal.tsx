import styled from "styled-components";
import { Dialog } from "@mui/material";
import React from "react";
import { CalendarEvent } from "@/components/Calendar/Calendar";

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

const Modal: React.FC<{
    eventClick: CalendarEvent | null;
    setEventClick: (data: CalendarEvent | null) => void;
}> = ({ eventClick, setEventClick }) => {
    if (!eventClick) {
        return <></>;
    }

    return (
        <StyledDialog open={true} onClose={() => setEventClick(null)}>
            <StyledCloseButton type="button" onClick={() => setEventClick(null)}>
                close
            </StyledCloseButton>
            <ModalInner>
                <h2>View Event</h2>
                <p>Event Title: {eventClick.title}</p>
                <p>
                    Start:{" "}
                    {eventClick.allDay
                        ? new Date(eventClick.start).toLocaleString("en-GB", dateFormatOptions)
                        : new Date(eventClick.start).toLocaleString("en-GB", dateTimeFormatOptions)}
                </p>
                <p>
                    End:{" "}
                    {eventClick.allDay
                        ? new Date(eventClick.end).toLocaleString("en-GB", dateFormatOptions)
                        : new Date(eventClick.end).toLocaleString("en-GB", dateTimeFormatOptions)}
                </p>
                {eventClick.description === undefined ? (
                    <></>
                ) : (
                    <p>Description: {eventClick.description}</p>
                )}
            </ModalInner>
        </StyledDialog>
    );
};

export default Modal;
