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
    start: Date;
    end: Date;
    description?: string;
    daysOfWeek?: number[];
    startRecur?: string;
    endRecur?: string;
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
    allDay?: boolean;
}

const StyledDialog = styled(Dialog)`
    // root
    & > div {
        // container
        > div {
            //Paper
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

// const StyledCalendar = styled(FullCalendar)`
//     /* & > div > div > div > button {
//         height: max(3vmin, 25px)!important;
//         font-size: max(1.5vmin, 10px)!important;
//         text-align: center;
//         vertical-align: middle;
//         padding: 0 10px 0 10px  !important;
//     }

//     .fc-icon {
//         font-size: max(1.5vmin, 10px)!important;
//     } */
//     background-color: orange!important;
//     > div {
//         transform: translate(50%, 50%);
//     }
// `;

const CalendarStyling = styled.div`
    .fc {
        background-color: white;
        border-radius: 2rem;
        padding: 1.5rem;
        text-align: center;
    }

    .fc .fc-toolbar-title {
        font-size: 1.5rem;
    }

    .fc .fc-toolbar-chunk {
        margin: 0 0.5rem;
    }

    .fc .fc-button {
        height: max(3vmin, 30px);
        font-size: max(1.5vmin, 15px);
        text-align: center;
        vertical-align: middle;
        padding: 0 10px 0 10px;
    }

    .fc .fc-icon {
        font-size: max(1.5vmin, 15px);
    }

    .fc .fc-button-primary {
        background-color: ${(props) => props.theme.fillColor};
        border-color: ${(props) => props.theme.fillColor};
        color: black;
    }

    .fc .fc-button-primary:hover {
        background-color: ${(props) => props.theme.fillColor};
        border-color: ${(props) => props.theme.fillColor};
        color: black;
    }

    .fc .fc-button-primary:not(:disabled).fc-button-active,
    .fc .fc-button-primary:not(:disabled):active {
        background-color: ${(props) => props.theme.fillColor};
        border-color: ${(props) => props.theme.fillColor};
        color: black;
    }
`;

const Calendar: React.FC<CalendarProps> = ({
    initialEvents,
    view = "dayGridMonth",
    editable = false,
    handleDateClick,
}) => {
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
                    <p>Description: {eventClick?.extendedProps.description}</p>
                </ModalInner>
            </StyledDialog>
            <CalendarStyling>
                <FullCalendar
                    viewClassNames="calendar-view"
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    headerToolbar={{
                        left: "prev,next",
                        center: "title",
                        right: "dayGridMonth,timeGridWeek,timeGridDay",
                    }}
                    events={initialEvents}
                    initialView={view}
                    editable={editable}
                    selectable={editable}
                    dateClick={handleDateClick}
                    eventClick={handleEventClick}
                />
            </CalendarStyling>
        </>
    );
};

export default Calendar;
