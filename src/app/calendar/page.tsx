"use client";

import { Metadata } from "next";
import React from "react";
import CalendarComponent, { EventProps } from "./calendar-component";

const SampleCalendar: React.FC<{}> = () => {
    const sampleEvents: EventProps[] = [
        {
            id: "1", // TODO: when properly implemented should be generated instead of passed in (i.e. in handleDateClick)
            title: "event1",
            start: "2023-07-11",
            end: "2023-07-13", // for overlapping
            backgroundColor: "red",
        },
        {
            id: "2",
            title: "event2",
            start: "2023-07-12",
            end: "2023-07-13", // end date exclusive
            daysOfWeek: [3], // repeats every wednesday and thurdsday (0 = sunday)
            startRecur: "2023-07-12", // starts repeating 
            endRecur: "2023-08-25", // ends repeating 
            borderColor: "yellow",
        },
        {
            id: "3",
            title: "event3",
            start: "2023-07-13T12:30:00", // time specified; default duration used
            textColor: "pink",
        },
    ];
    return <CalendarComponent view={"timeGridWeek"} events={sampleEvents} editable={true} />;
};

export const metadata: Metadata = {
    title: "Calendar",
};

export default SampleCalendar;
