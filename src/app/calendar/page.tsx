import { Metadata } from "next";
import SampleCalendar from "./samplePage";
import React from "react";

export const metadata: Metadata = {
    title: "Calendar",
};

const CalendarPage: React.FC<{}> = () => {
    return (
        <main>
            <h1>Calendar Page</h1>
            <SampleCalendar />
        </main>
    );
};

export default CalendarPage;
