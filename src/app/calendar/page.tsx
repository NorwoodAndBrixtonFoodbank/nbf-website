import { Metadata } from "next";
import React from "react";
import ParcelCalendar from "@/app/calendar/ParcelCalendar";
import { getClientMap, getParcelsWithCollectionDate } from "@/app/calendar/parcelCalendarFunctions";

const CalendarPage = async (): Promise<React.ReactElement> => {
    const [clientMap, parcelsWithCollectionDate] = await Promise.all([
        getClientMap(),
        getParcelsWithCollectionDate(),
    ]);

    return (
        <main>
            <ParcelCalendar
                clientMap={clientMap}
                parcelsWithCollectionDate={parcelsWithCollectionDate}
            />
        </main>
    );
};

export const metadata: Metadata = {
    title: "Calendar",
};

export default CalendarPage;
