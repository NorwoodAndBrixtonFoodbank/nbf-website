import { Metadata } from "next";
import React from "react";
import SampleCalendar from "./samplePage";

const CalendarPage: React.FC<{}> = () => {
    return (
        <main>
            <h1>Calendar Page </h1>
        </main>
    );
};

export const metadata: Metadata = {
    title: "Calendar",
};

export default CalendarPage;
