"use client";

import React, { Key, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";

interface CalendarProps {
    // timezone is "local" by default
    view: string;
    initialEvents: EventObjects[]; // TODO: static for now -> interactive aspects not needed

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

export interface EventObjects {
    // TODO: consider using Resources -> but this requires premium. Maybe can do manually.
    id: string; // TODO: needs to be unique - perhaps username + timestamp? counter? needs to be stable;
    title: string;
    start: Date;
    end?: Date; // exclusive, and defaults to 00:00:00 if only date and no time specified
    daysOfWeek?: number[];
    startRecur?: string;
    endRecur?: string;

    // styling
    // TODO: implement so that styling can be grouped (e.g. dependent on the region or organisation)
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
}

let counter = 0;

const CalendarComponent: React.FC<CalendarProps> = ({ view, initialEvents, editable, eventOverlap, eventDisplay }) => {

    // Interaction
    const [events, setEvents] = useState(initialEvents);

    const handleDateClick = (info: DateClickArg) => {
        console.log("Date Clicked");
        // TODO: get the info.dateStr and pass into Calendar.addEvent (need to first sort out Calendar object)
    };    

    // Calendar 
    return (
        <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView={view} // TODO: use this instead
                                // headerToolbar={{
                                //     left: "prev,next today",
                                //     center: "title",
                                //     right: "dayGridMonth,timeGridWeek,timeGridDay",
                                // }}
            events={events}
            editable={editable ?? false}
            eventOverlap={eventOverlap ?? true}
            eventDisplay={eventDisplay ?? "auto"}

            // Interaction
            dateClick={handleDateClick} // TODO: check if this is actually needed
            eventAdd={() => console.log("Add")}
            select={(e) => {
                const newEvent = {
                    id: `${counter++}`,
                    title: "Whaddup",
                    end: e.end,
                    start: e.start,
                };
                console.log(JSON.stringify(newEvent));
                setEvents (
                    [...events, newEvent]
                );
            }}
            // eventClick={handleEventClick}
            // eventsSet={handleEvents}
            // Can add some eventBackgroundColor, eventBorderColor and evenTextColor for default styling
        />
    );
};

export default CalendarComponent;
