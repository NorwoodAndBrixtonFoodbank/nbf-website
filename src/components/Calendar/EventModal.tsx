"use client";

import React from "react";
import { CalendarEvent } from "@/components/Calendar/Calendar";
import styled from "styled-components";
import Modal from "@/components/Modal/Modal";

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

const StyledParagraph = styled.p`
    margin: 1em 0.5em;
`;

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
        <Modal
            header={eventClick.title}
            headerId="calendarEvent"
            isOpen={true}
            onClose={() => setEventClick(null)}
        >
            <StyledParagraph>Start: {startDate}</StyledParagraph>
            <StyledParagraph>End: {endDate}</StyledParagraph>
            {eventClick.description && (
                <StyledParagraph>Description: {eventClick.description}</StyledParagraph>
            )}
        </Modal>
    );
};

export default EventModal;
