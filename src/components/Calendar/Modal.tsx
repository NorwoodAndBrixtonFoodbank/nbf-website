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

const StyledCancelButton = styled.button`
    position: absolute;
    right: 20px;
    top: 20px;
`;

const ModalInner = styled.div`
    display: flex;
    flex-direction: column;
    row-gap: 1rem;
`;

const dateFormatOptions: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
};

const Modal: React.FC<{
    eventClick: CalendarEvent;
    setEventClick: (data: CalendarEvent | null) => void;
}> = ({ eventClick, setEventClick }) => {
    return (
        <StyledDialog open={eventClick !== null} onClose={() => setEventClick(null)}>
            <StyledCancelButton type="button" onClick={() => setEventClick(null)}>
                close
            </StyledCancelButton>
            <ModalInner>
                <h2>View Event</h2>
                <p>Event Title: {eventClick.title}</p>
                <p>
                    Start:
                    {new Date(eventClick.start).toLocaleString("en-GB", dateFormatOptions)}
                </p>
                <p>
                    End:
                    {new Date(eventClick.end).toLocaleString("en-GB", dateFormatOptions)}
                </p>
                <p>Description: {eventClick.description}</p>
            </ModalInner>
        </StyledDialog>
    );
};

export default Modal;
