"use client";

import React from "react";
import Calendar, { CalendarEvent as CalendarEvent } from "../../components/Calendar/Calendar";
import { styled } from "styled-components";

const SampleCalendar: React.FC<{}> = () => {
    const sampleEvents: CalendarEvent[] = [
        {
            id: "a",
            title: "event1",
            start: new Date("2023-07-11"), // default Date constructor assumes UTC by default
            end: new Date("2023-07-12"),
            backgroundColor: "red",
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
            textColor: "pink",
        },
    ];

    return <StyledCalendar initialEvents={sampleEvents} editable={true} />;
};

const StyledCalendar = styled(Calendar)`
    height: calc(100vh - 120px);
`;

export default SampleCalendar;
