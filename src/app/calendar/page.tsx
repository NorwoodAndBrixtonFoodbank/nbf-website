"use client";

import { Metadata } from "next";
import React from "react";
import CalendarComponent, { EventObjects as EventObjects } from "./calendar-component";

const SampleCalendar: React.FC<{}> = () => {
    const sampleEvents: EventObjects[] = [
        {
            id: "a", // TODO: when properly implemented should be generated instead of passed in (i.e. in handleDateClick)
            title: "event1",
            start: new Date("2023-07-11"), // TODO: Bug here -> possibly timezone 
            end: new Date("2023-07-12"), // for overlapping
            backgroundColor: "red",
        },
        {
            id: "b",
            title: "event2",
            start: new Date("2023-07-12"),
            end: new Date("2023-07-13"), // end date exclusive
            daysOfWeek: [3], // repeats every wednesday and thurdsday (0 = sunday)
            startRecur: "2023-07-12", // starts repeating 
            endRecur: "2023-08-25", // ends repeating 
            borderColor: "yellow",
        },
        {
            id: "c",
            title: "event3",
            start: new Date("2023-07-13T12:30:00"), // time specified; default duration used
            textColor: "pink",
        },
    ];

    // TODO: do something about this please TT
    return <> 
        <style>{`
    .fc {
        height: calc(100vh - 120px)
    }
    `}</style>
        <CalendarComponent initialEvents={sampleEvents} editable={true} />;
    </>
};

export const metadata: Metadata = {
    title: "Calendar",
};

export default SampleCalendar;
