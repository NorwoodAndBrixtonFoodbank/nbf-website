"use client";

import React, { useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { EventClickArg } from "@fullcalendar/core";
import styled from "styled-components";
import EventModal from "@/components/Calendar/EventModal";

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
}

const CalendarStyling = styled.div`
    --fc-button-active-bg-color: ${(props) => props.theme.primary.background[3]};
    --fc-button-active-border-color: ${(props) => props.theme.primary.background[3]};
    --fc-button-text-color: ${(props) => props.theme.primary.foreground[3]};

    --fc-border-color: ${(props) => props.theme.main.border};

    --fc-small-font-size: 0.8em;

    --fc-page-bg-color: transparent;
    --fc-today-bg-color: ${(props) => props.theme.primary.background[0]};

    .fc {
        background-color: ${(props) => props.theme.main.background[0]};
        color: ${(props) => props.theme.main.foreground[0]};
        box-shadow: 0 0 15px ${(props) => props.theme.shadow};
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
        background-color: ${(props) => props.theme.primary.background[1]};
        border-color: ${(props) => props.theme.primary.background[1]};
        color: ${(props) => props.theme.primary.foreground[1]};
    }

    // prev and next arrow icons
    .fc .fc-button {
        font-size: 15px;
        height: 32px;
        padding: 0 10px;
    }

    // days in the previous month
    .fc .fc-day-other .fc-daygrid-day-top {
        opacity: 1;
    }

    .fc .fc-day-other {
        background-color: ${(props) => props.theme.main.background[1]};
        color: ${(props) => props.theme.main.lighterForeground};
    }

    // adjust month view grid display
    .fc .fc-daygrid-day-frame {
        cursor: pointer;
        min-height: 6em;
    }

    // adjust event display
    .fc .fc-event-time {
        overflow: hidden;
    }

    .fc .fc-event-title {
        flex-shrink: 99;
    }

    // adjust background color of headers
    .fc thead {
        background-color: ${(props) => props.theme.main.background[2]};
    }

    // dynamic sizing of calendar
    @media only screen and (max-width: 450px) {
        .fc .fc-toolbar-title {
            font-size: 20px;
        }

        .fc .fc-col-header-cell-cushion,
        .fc .fc-daygrid-day-number,
        .fc .fc-timegrid-axis-cushion,
        .fc .fc-timegrid-slot-label-cushion {
            font-size: 12px;
        }

        .fc .fc-event-title,
        .fc .fc-daygrid-more-link,
        .fc .fc-event-time {
            font-size: 10px;
        }

        .fc .fc-button {
            font-size: 12px;
            height: 25px;
            padding: 0 6px;
        }
    }

    @media only screen and (max-width: 400px) {
        .fc .fc-toolbar-title {
            font-size: 16px;
        }

        .fc .fc-col-header-cell-cushion,
        .fc .fc-daygrid-day-number,
        .fc .fc-timegrid-axis-cushion,
        .fc .fc-timegrid-slot-label-cushion {
            font-size: 10px;
        }
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

const Calendar: React.FC<CalendarProps> = ({
    initialEvents,
    view = "dayGridMonth",
    editable = false,
    initialDate,
}) => {
    const [eventClick, setEventClick] = useState<CalendarEvent | null>(null);
    const calendarRef = useRef<FullCalendar>(null) as React.MutableRefObject<FullCalendar>;

    const handleEventClick = (info: EventClickArg): void => {
        const id = info.event.id;
        setEventClick(initialEvents.find((event) => event.id === id) ?? null);
    };

    const handleDateClick = (info: DateClickArg): void => {
        const calendarApi = calendarRef.current.getApi();
        calendarApi.changeView("timeGridDay", info.dateStr);
    };

    return (
        <>
            <EventModal eventClick={eventClick} setEventClick={setEventClick} />
            <CalendarStyling>
                <FullCalendar
                    ref={calendarRef}
                    viewClassNames="calendar-view"
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    headerToolbar={{
                        left: "prev,next",
                        center: "title",
                        right: "dayGridMonth,timeGridWeek,timeGridDay",
                    }}
                    events={makeAllDayEventsInclusive(initialEvents)}
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
                            dayMaxEventRows: 4,
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
                />
            </CalendarStyling>
        </>
    );
};

export default Calendar;
