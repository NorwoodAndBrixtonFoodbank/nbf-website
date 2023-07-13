import { Metadata } from "next";
import SampleCalendar from "./samplePage";
import React from "react";

export const metadata: Metadata = {
    title: "Calendar",
};

const CalendarPage: React.FC<{}> = () => {
    return (
        <>
            <SampleCalendar />;
        </>
    );
};

export default CalendarPage;
