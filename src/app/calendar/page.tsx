import { Metadata } from "next";
import React from "react";
import ParcelCalendar from "./ParcelCalender";

const CalendarPage: () => Promise<React.ReactElement> = async () => {
    return (
        <main>
            <h1> Calendar Page </h1>
            <ParcelCalendar />
        </main>
    );
};

export const metadata: Metadata = {
    title: "Calendar",
};

export default CalendarPage;
