"use client";

import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { EventClickArg } from "@fullcalendar/core";
import styled from "styled-components";
import Modal from "@/components/Calendar/Modal";

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
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
    allDay?: boolean;
}

const CalendarStyling = styled.div`
    --fc-button-active-bg-color: ${(props) => props.theme.accentBackgroundColor};
    --fc-button-active-border-color: ${(props) => props.theme.accentBackgroundColor};
    --fc-neutral-text-color: ${(props) => props.theme.surfaceForegroundColor};

    .fc {
        background-color: ${(props) => props.theme.surfaceBackgroundColor};
        color: ${(props) => props.theme.surfaceForegroundColor};
        border-radius: 2rem;
        padding: 1.5rem;
        text-align: center;
    }

    .fc .fc-toolbar-title {
        font-size: 1.5rem;
    }

    // group of buttons in the toolbar
    .fc .fc-toolbar-chunk {
        margin: 0 0.5rem;
    }

    .fc .fc-button {
        height: max(3vmin, 30px);
        font-size: max(1.5vmin, 15px);
        text-align: center;
        vertical-align: middle;
        padding: 0 10px;
        background-color: ${(props) => props.theme.primaryBackgroundColor};
        border-color: ${(props) => props.theme.primaryBackgroundColor};
        color: ${(props) => props.theme.primaryForegroundColor};
    }

    // prev and next arrow icons
    .fc .fc-icon {
        font-size: max(1.5vmin, 15px);
    }

    .fc .fc-day-other .fc-daygrid-day-top {
        opacity: 0.6;
    }
`;

const endDateInclusiveEvents = (endDateExclusiveEvents: CalendarEvent[]): CalendarEvent[] => {
    return endDateExclusiveEvents.map((exclusiveEvent: CalendarEvent) => {
        const cloneEndDate = new Date(exclusiveEvent.end);
        if (exclusiveEvent.allDay) {
            cloneEndDate.setDate(cloneEndDate.getDate() + 1);
        }
        const inclusiveEvent: CalendarEvent = { ...exclusiveEvent, end: cloneEndDate };
        return inclusiveEvent;
    });
};

const Calendar: React.FC<CalendarProps> = ({
    initialEvents,
    view = "dayGridMonth",
    editable = false,
    handleDateClick,
}) => {
    const [eventClick, setEventClick] = useState<CalendarEvent | null>(null);

    const handleEventClick = (info: EventClickArg): void => {
        const id = info.event.id;
        setEventClick(initialEvents.find((event) => event.id === id) ?? null);
    };

    return (
        <>
            <Modal eventClick={eventClick} setEventClick={setEventClick} />
            <CalendarStyling>
                <FullCalendar
                    viewClassNames="calendar-view"
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    headerToolbar={{
                        left: "prev,next",
                        center: "title",
                        right: "dayGridMonth,timeGridWeek,timeGridDay",
                    }}
                    events={endDateInclusiveEvents(initialEvents)}
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
