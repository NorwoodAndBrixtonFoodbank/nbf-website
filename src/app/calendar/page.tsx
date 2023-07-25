import { Metadata } from "next";
import React from "react";
import ParcelCalendar from "@/app/calendar/ParcelCalendar";

const CalendarPage: Promise<React.ReactElement> = async () => {
    return (
        <main>
            <ParcelCalendar />
        </main>
    );
};

export const metadata: Metadata = {
    title: "Calendar",
};

export default CalendarPage;
