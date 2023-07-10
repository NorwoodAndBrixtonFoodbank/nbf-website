"use client";

import React, { Key } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

interface CalendarProps {
    // timezone is "local" by default
    view: string;
    events: EventProps[]; // TODO: static for now -> interactive aspects not needed

    // can be edited on event basis as well (need to modify EventProps)
    editable?: boolean; // all events can be dragged (change start) and resized (change duration)
    eventOverlap?: boolean; // all events can be edited to overlap each other
    eventDisplay?: string /* renders normally in timeGrid view; 
                        "auto" - in dayGrid view: solid rectangle if all or multi day event, dot if timed event 
                        "block" - in dayGrid view: solid rectangle 
                        "list-item" - in dayGrid view: dots 
                        "background" - in dayGrid view: timed event disappears. In both views, rendered as a color-fill. 
                        */;
    
    // TODO: Check out content injection and eventContent for popups when clicked on event 
}

export interface EventProps {
    // TODO: consider using Resources -> but this requires premium. Maybe can do manually.
    id: string; // TODO: needs to be unique - perhaps username + timestamp? needs to be stable
    title: string;
    start: string;
    end?: string; // exclusive, and defaults to 00:00:00 if only date and no time specified
    daysOfWeek?: number[];
    startRecur?: string;
    endRecur?: string;

    // styling
    // TODO: implement so that styling can be grouped (e.g. dependent on the region or organisation)
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
}

const CalendarComponent: React.FC<CalendarProps> = ({ view, events, editable, eventOverlap, eventDisplay }) => {
    return (
        <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView={view}
            events={events}
            editable={editable ?? false}
            eventOverlap={eventOverlap ?? true}
            eventDisplay={eventDisplay ?? "auto"}
        />
    );
};

export default CalendarComponent;
