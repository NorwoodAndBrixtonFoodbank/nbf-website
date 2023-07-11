"use client";

import React, { Key, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { EventApi, EventClickArg } from "@fullcalendar/core";
import Modal from "react-modal";
import styled from "styled-components";

// TODO: Clean Comments

interface CalendarProps {
    // timezone is "local" by default
    initialEvents: EventObjects[]; // TODO: static for now -> interactive aspects not needed
    view?: string;
    
    // can be edited on event basis as well (need to modify EventProps)
    editable?: boolean;
    eventOverlap?: boolean;
    eventDisplay?: string /* renders normally in timeGrid view; 
                        "auto" - in dayGrid view: solid rectangle if all or multi day event, dot if timed event 
                        "block" - in dayGrid view: solid rectangle 
                        "list-item" - in dayGrid view: dots 
                        "background" - in dayGrid view: timed event disappears. In both views, rendered as a color-fill. 
                        */;

    // TODO: Check out content injection and eventContent for popups when clicked on event
}

export interface EventObjects {
    id: string; // TODO: needs to be unique - perhaps username + timestamp? counter? needs to be stable;
    title: string;
    start?: Date;
    end?: Date; 
    daysOfWeek?: number[];
    startRecur?: string;
    endRecur?: string;

    // styling
    // TODO: implement so that styling can be grouped (e.g. dependent on the region or organisation)
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
}

let counter = 0; // TODO: Ensure this is global and doesn't reset for each render. Perhaps get from database. 

const CalendarComponent: React.FC<CalendarProps> = ({ initialEvents, view, editable, eventOverlap, eventDisplay }) => {

    // Interaction

    Modal.setAppElement("body");

    const [modal, setModal] = useState("");
    const [events, setEvents] = useState(initialEvents);

    const handleDateClick = (info: DateClickArg) => {
        setModal("Add Event");
        console.log("Date Clicked");
        // TODO: get the info.dateStr and pass into Calendar.addEvent (need to first sort out Calendar object)
    };

    function addEvent() {
        const newEvent = {
            id: `${counter++}`,
            title: "(New Event)",
            start: new Date("2023-07-12"),
        };
        setEvents([...events, newEvent]);
    }

    function handleEventClick(info: EventClickArg){
        setModal("Change Event");
        console.log("Event Clicked");
        // TODO: have form-like things to change event OR delete the event 
    }

 
    // TODO: clicking outside the modal should close it
    // TODO: Change styling of modal

    const ModalStyle = styled(Modal)`
        width: min(50%, 600px);
        height: min(50%, 800px);
        position: fixed;
        color: black;
        text-align: center;
        padding: 1em;
        border-radius: 20px;
        margin: 25% 25% 25%
    `

    // TODO: the following + center
    // boxShadow: 2px 2px 5px rgba(64, 64, 64, 0.8)
    // overlay: {zIndex: 10, backgroundColor: rgba(128, 128, 128, 0.6)}

    // Calendar 
    return (
        <>
            <ModalStyle isOpen={!!modal}>
                <button type="button" style={{position: "absolute", right:"20px", top: "20px"}} onClick={() => setModal("")}>close</button>
                <h2>{modal}</h2>
            </ModalStyle>
            <FullCalendar
            viewClassNames={"calendar-view"}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                events={events}
                initialView={view ?? "dayGridMonth"}
                editable={editable ?? false}
                eventOverlap={eventOverlap ?? true}
                eventDisplay={eventDisplay ?? "auto"}
                selectable={editable}
                // Interaction
                dateClick={handleDateClick} // TODO: check if this is actually needed
                eventAdd={() => console.log("Add")}
                // select={(e) => {
                //     // use the modal
                //     const newEvent = {
                //         id: `${counter++}`,
                //         title: "(New Event)",
                //         end: e.end,
                //         start: e.start,
                //     };
                //     // console.log(JSON.stringify(newEvent));
                //     setEvents(
                //         [...events, newEvent]
                //     );
                // }}
                eventClick={handleEventClick}
            // Can add some eventBackgroundColor, eventBorderColor and evenTextColor for default styling
            />
        </>
    );
};

export default CalendarComponent;


// TODO: 

// Clean Code A Bit 

// Do Styling 
// Make More Generalized Tests

// Do interactive Bits 

