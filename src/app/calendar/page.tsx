import { Metadata } from "next";
import SampleCalendar from "./clientPage";
import React from "react";

export const metadata: Metadata = {
    title: "Calendar",
};

const CalendarPage: React.FC<{}> = () => {
    return (
        <>
            <h1>Calendar Page</h1>
            <SampleCalendar />;
        </>
    );
};

export default CalendarPage;
