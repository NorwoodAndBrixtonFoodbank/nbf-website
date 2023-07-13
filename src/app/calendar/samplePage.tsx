"use client";

import React from "react";
import Calendar, { CalendarEvent as CalendarEvent } from "../../components/Calendar/Calendar";
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
    const sampleEvents: CalendarEvent[] = [
        {
            id: "a",
            title: "event1",
            start: new Date("2023-07-11"), // default Date constructor assumes UTC by default
            end: new Date("2023-07-12"),
            backgroundColor: "red",
            allDay: true,
        },
        {
            id: "b",
            title: "event2",
            start: new Date("2023-07-12"),
            end: new Date("2023-07-13"),
            daysOfWeek: [3],
            startRecur: "2023-07-12",
            endRecur: "2023-08-25",
            borderColor: "yellow",
        },
        {
            id: "c",
            title: "event3",
            start: new Date("2023-07-13T12:30:00"),
            end: new Date("2023-07-13T13:30:00"),
            textColor: "pink",
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
