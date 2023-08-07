import { Metadata } from "next";
import React from "react";
import ParcelCalendar from "@/app/calendar/ParcelCalendar";
import { getParcelsWithCollectionDate } from "@/app/calendar/parcelCalendarFunctions";

const CalendarPage = async (): Promise<React.ReactElement> => {
    const parcelsWithCollectionDate = await getParcelsWithCollectionDate();

    return (
        <main>
            <ParcelCalendar parcelsWithCollectionDate={parcelsWithCollectionDate} />
        </main>
    );
};

export const metadata: Metadata = {
    title: "Calendar",
};

export default CalendarPage;
