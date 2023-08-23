"use client";

import React, { useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { EventClickArg } from "@fullcalendar/core";
import styled from "styled-components";
import EventModal from "@/components/Calendar/EventModal";
import { Paper } from "@mui/material";
import CalendarFilters from "@/components/Calendar/Filters";

export interface CalendarProps {
    initialEvents: CalendarEvent[];
    view?: string;
    editable?: boolean;
    initialDate?: Date;
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
    location: string;
}

const CalendarStyling = styled(Paper)`
    border-radius: 2rem;
    padding: 1.5rem;

    --fc-button-active-bg-color: ${(props) => props.theme.primary.background[3]};
    --fc-button-active-border-color: ${(props) => props.theme.primary.background[3]};
    --fc-button-text-color: ${(props) => props.theme.primary.foreground[3]};

    --fc-border-color: ${(props) => props.theme.main.border};

    --fc-small-font-size: 0.8em;

    --fc-page-bg-color: transparent;
    --fc-today-bg-color: transparent;

    .fc {
        color: ${(props) => props.theme.main.foreground[0]};
        background: transparent;
        text-align: center;
    }

    .fc .fc-toolbar-title {
        font-size: min(5vw, 1.5rem);
    }
    .fc .fc-icon {
        font-size: min(4vw, 1.2rem);
    }
    .fc .fc-scrollgrid-section-header.fc-scrollgrid-section-sticky > * {
        top: 4rem;
    }
    .fc .fc-col-header-cell-cushion,
    .fc .fc-daygrid-day-number,
    .fc .fc-timegrid-axis-cushion,
    .fc .fc-timegrid-slot-label-cushion,
    .fc .fc-daygrid-more-link,
    .fc .fc-event-title,
    .fc .fc-event-time {
        font-size: min(4vw, 1rem);
    }

    // month view grid display
    .fc .fc-daygrid-day-frame {
        cursor: pointer;
        min-height: min(20vw, 7rem);
    }

    // month view events
    .fc-dayGridMonth-view .fc-daygrid-day-number {
        font-size: min(3vw, 1rem);
    }
    .fc-dayGridMonth-view .fc-event-title,
    .fc-dayGridMonth-view .fc-event-time,
    .fc-dayGridMonth-view .fc-daygrid-more-link {
        font-size: min(2.7vw, 0.9rem);
    }

    .fc-dayGridMonth-view .fc-event-title {
        width: 100%;
        text-align: left;
    }

    // week view events
    .fc-timeGridWeek-view .fc-event-title-container {
        width: 100%;
        height: 100%;
    }

    .fc-timeGridWeek-view .fc-event-title,
    .fc-timeGridWeek-view .fc-event-time {
        font-size: min(2.5vw, 1rem);
    }

    // general event display
    .fc .fc-event-time {
        overflow: hidden;
    }

    .fc .fc-event-title-container {
        flex-shrink: 80;
    }

    @media (hover: hover) {
        .fc .fc-event:hover {
            box-shadow: 0 3px 2px ${(props) => props.theme.shadow};
        }
    }

    // group of buttons in the toolbar
    .fc .fc-toolbar-chunk {
        margin: 0 0.5rem;
    }

    .fc .fc-button {
        height: min(8.2vw, 2.25rem);
        font-size: min(4vw, 1.1rem);
        padding: 0 min(2.5vw, 0.75rem);
        text-align: center;
        vertical-align: middle;
        color: ${(props) => props.theme.primary.foreground[1]};
        background-color: ${(props) => props.theme.primary.background[1]};
        border-color: ${(props) => props.theme.primary.background[1]};

        @media (hover: hover) {
            &:hover {
                color: ${(props) => props.theme.primary.foreground[2]};
                background-color: ${(props) => props.theme.primary.background[2]};
                border-color: ${(props) => props.theme.primary.background[2]};
            }
        }
    }

    .fc .fc-button-active {
        color: ${(props) => props.theme.primary.foreground[3]};
        background-color: ${(props) => props.theme.primary.background[3]};
        border-color: ${(props) => props.theme.primary.background[3]};
    }

    .fc .fc-button-primary:focus,
    .fc .fc-button:focus,
    .fc .fc-button-primary:not(:disabled).fc-button-active:focus,
    .fc .fc-button-primary:not(:disabled):active:focus {
        box-shadow: none;
    }

    // days in the previous month
    .fc .fc-day-other .fc-daygrid-day-top {
        opacity: 1;
    }

    .fc .fc-day-other {
        > div {
            color: ${(props) => props.theme.main.lighterForeground[2]};
            background-color: ${(props) => props.theme.main.background[2]};
        }
    }

    .fc .fc-day-today {
        > div {
            color: ${(props) => props.theme.primary.foreground[0]};
            background-color: ${(props) => props.theme.primary.background[0]};
        }
    }

    // color of headers
    .fc thead {
        color: ${(props) => props.theme.main.foreground[2]};
        background-color: ${(props) => props.theme.main.background[2]};
    }
`;
const makeAllDayEventsInclusive = (endDateExclusiveEvents: CalendarEvent[]): CalendarEvent[] => {
    return endDateExclusiveEvents.map((exclusiveEvent: CalendarEvent): CalendarEvent => {
        const copiedEndDate = new Date(exclusiveEvent.end);

        if (exclusiveEvent.allDay) {
            copiedEndDate.setDate(copiedEndDate.getDate() + 1);
        }

        return { ...exclusiveEvent, end: copiedEndDate };
    });
};

// TODO VFB-27: Get this from database
const initialLocations = [
    "Vauxhall Hope Church",
    "Waterloo - St George the Martyr",
    "Waterloo - Oasis",
    "Waterloo - St Johns",
    "Brixton Hill - Methodist Church",
    "N&B - Emmanuel Church",
    "Streatham - Immanuel and St Andrew",
];

const filterEventsByLocation = (
    locations: string[],
    allEvents: CalendarEvent[]
): CalendarEvent[] => {
    const viewedEvents: CalendarEvent[] = [];
    allEvents.forEach((event: CalendarEvent) => {
        if (locations.includes(event.location)) {
            viewedEvents.push(event);
        }
    });
    return makeAllDayEventsInclusive(viewedEvents);
};

const Calendar: React.FC<CalendarProps> = ({
    initialEvents,
    view = "dayGridMonth",
    editable = false,
    initialDate,
}) => {
    const [eventClick, setEventClick] = useState<CalendarEvent | null>(null);
    const calendarRef = useRef<FullCalendar>(null);

    const handleEventClick = (info: EventClickArg): void => {
        const id = info.event.id;
        setEventClick(initialEvents.find((event) => event.id === id) ?? null);
    };

    const handleDateClick = (info: DateClickArg): void => {
        const calendarApi = calendarRef.current!.getApi();
        calendarApi.changeView("timeGridDay", info.dateStr);
    };

    const [locations, setLocations] = useState(initialLocations);

    return (
        <>
            <EventModal eventClick={eventClick} setEventClick={setEventClick} />
            <CalendarStyling>
                <CalendarFilters
                    allLocations={initialLocations}
                    editLocations={setLocations}
                    currentLocations={locations}
                />
                <FullCalendar
                    ref={calendarRef}
                    viewClassNames="calendar-view"
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    headerToolbar={{
                        left: "prev,next",
                        center: "title",
                        right: "dayGridMonth,timeGridWeek,timeGridDay",
                    }}
                    events={filterEventsByLocation(locations, initialEvents)}
                    initialView={view}
                    editable={editable}
                    selectable={editable}
                    dateClick={handleDateClick}
                    eventClick={handleEventClick}
                    initialDate={initialDate}
                    views={{
                        dayGridMonth: {
                            eventTimeFormat: {
                                hour: "numeric",
                                minute: "2-digit",
                                meridiem: "short",
                            },
                            titleFormat: { year: "numeric", month: "short" },
                            dayMaxEventRows: 3,
                            moreLinkClick: "day",
                        },
                        timeGridWeek: {
                            displayEventTime: false,
                            titleFormat: { year: "numeric", month: "short" },
                        },
                        timeGridDay: {
                            eventTimeFormat: {
                                hour: "numeric",
                                minute: "2-digit",
                                meridiem: "short",
                            },
                            titleFormat: { year: "numeric", month: "short", day: "numeric" },
                        },
                    }}
                    eventInteractive={true}
                    height="auto"
                    eventDisplay="block"
                />
            </CalendarStyling>
        </>
    );
};

export default Calendar;
