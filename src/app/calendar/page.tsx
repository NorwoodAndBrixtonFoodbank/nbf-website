import { Metadata } from "next";
import React from "react";
import ParcelCalendar from "@/app/calendar/ParcelCalendar";
import getParcelCalendarEvents from "@/app/calendar/getParcelCalendarEvents";

const CalendarPage = async (): Promise<React.ReactElement> => {
    const events = await getParcelCalendarEvents();

    return (
        <main>
            <ParcelCalendar events={events} />
        </main>
    );
};

export const metadata: Metadata = {
    title: "Calendar",
};

export default CalendarPage;
