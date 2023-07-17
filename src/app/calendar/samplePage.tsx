"use client";

import React from "react";
import Calendar, { CalendarEvent } from "@/components/Calendar/Calendar";
import { styled } from "styled-components";

const Centerer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;
const SizedAspectRatio = styled.div`
    width: 100vmin;
    height: 100vmin;
`;

const SampleCalendar: React.FC<{}> = () => {
    /*
    unless a timezone is specified, the ISO8601 standard assumes UTC (and therefore so does the date constructor). 
    The calendar will then display the date in the local timezone, which is why the date displayed is 1 hour 
    later than the date specified when in BST. When printing to the console, a JS Date object will also be displayed 
    in the local timezone but is internally stored as UTC.
    Methods like Date.prototype.getHours() etc. return values in local time. 
 */
    const sampleEvents: CalendarEvent[] = [
        {
            id: "a",
            title: "event1",
            start: new Date("2023-07-11"),
            end: new Date("2023-07-12"),
            backgroundColor: "red",
            textColor: "black",
            allDay: true,
        },
        {
            id: "b",
            title: "event2",
            start: new Date("2023-07-12"),
            end: new Date("2023-07-13"),
            borderColor: "yellow",
            textColor: "black",
        },
        {
            id: "c",
            title: "event3",
            start: new Date("2023-07-13T12:30:00"),
            end: new Date("2023-07-13T13:30:00"),
            textColor: "pink",
            backgroundColor: "black",
            description: "This is a cool event",
        },
    ];

    return (
        <Centerer>
            <SizedAspectRatio>
                <Calendar initialEvents={sampleEvents} editable={true} />
            </SizedAspectRatio>
        </Centerer>
    );
};

export default SampleCalendar;
