import { Metadata } from "next";
import React from "react";
import ParcelCalendar from "@/app/calendar/ParcelCalendar";
import {
    ClientMap,
    getClientMap,
    getParcelsWithCollectionDate,
} from "@/app/calendar/parcelCalendarFunctions";
import { Schema } from "@/supabase";

const CalendarPage = async (): Promise<React.ReactElement> => {
    const clientMap: ClientMap = await getClientMap();
    const parcelsWithCollectionDate: Schema["parcels"][] = await getParcelsWithCollectionDate();

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
