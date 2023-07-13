"use client";

import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { EventClickArg } from "@fullcalendar/core";
import styled from "styled-components";
import { Dialog } from "@mui/material";
import { EventImpl } from "@fullcalendar/core/internal";

interface CalendarProps {
    initialEvents: CalendarEvent[];
    view?: string;
    editable?: boolean;
    handleDateClick?: (info: DateClickArg) => void;
}

export interface CalendarEvent {
    id: string;
    title: string;
    start?: Date;
    end?: Date;
    daysOfWeek?: number[];
    startRecur?: string;
    endRecur?: string;
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
}

const CalendarWrapper = styled.div`
    /* width: min(80%, 1366px); */
    /* aspect-ratio: 1; */
    height: 100%;
    overflow: auto;
`;

const StyledCalendar = styled(FullCalendar)`
    /* width: 100%;
    height: 100%;
    margin: 0 auto; */
`;

const StyledDialog = styled(Dialog)`
    // root

    // container
    & > div {
        //Paper
        > div {
            width: min(50%, 600px);
            border-radius: 2rem;
            padding: 1.5rem;
            text-align: center;
        }
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

const Calendar: React.FC<CalendarProps> = ({ initialEvents, view, editable, handleDateClick }) => {
    const [modalViewEvent, setModalViewEvent] = useState(false);
    const [eventClick, setEventClick] = useState<EventImpl | null>(null);

    function handleEventClick(info: EventClickArg): void {
        setModalViewEvent(true);
        setEventClick(info.event);
    }

    const dateFormatOptions: Intl.DateTimeFormatOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
    };

    return (
        <>
            <StyledDialog open={modalViewEvent} onClose={() => setModalViewEvent(false)}>
                <StyledCancelButton type="button" onClick={() => setModalViewEvent(false)}>
                    close
                </StyledCancelButton>
                <ModalInner>
                    <h2>View Event</h2>
                    <p>Event Title: {eventClick?.title}</p>
                    <p>
                        Start:
                        {new Date(eventClick?.startStr!).toLocaleString("en-GB", dateFormatOptions)}
                    </p>
                    <p>
                        End:
                        {new Date(eventClick?.endStr!).toLocaleString("en-GB", dateFormatOptions)}
                    </p>
                </ModalInner>
            </StyledDialog>
            <style>
                {`
                    .fc-button {
                        height: max(3vmin, 25px)!important;
                        font-size: max(1.5vmin, 10px)!important;
                        text-align: center;
                        vertical-align: middle;
                        padding: 0 10px 0 10px  !important;
                    }

                    .fc-icon {
                    }
                `}
            </style>
            <FullCalendar
                viewClassNames="calendar-view"
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                headerToolbar={{
                    left: "prev,next",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                events={initialEvents}
                initialView={view ?? "dayGridMonth"}
                editable={editable ?? false}
                selectable={editable}
                dateClick={handleDateClick}
                eventClick={handleEventClick}
            />
        </>
    );
};

export default Calendar;
