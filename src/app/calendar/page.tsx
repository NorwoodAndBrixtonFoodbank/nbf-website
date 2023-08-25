import { Metadata } from "next";
import React from "react";
import ParcelCalendar from "@/app/calendar/ParcelCalendar";
import supabase from "@/supabaseServer";
import { ParcelsWithExtraFields } from "@/app/calendar/parcelCalendarFunctions";

export const dynamic = "force-dynamic";

const getParcelsWithCollectionDate = async (): Promise<ParcelsWithExtraFields[]> => {
    const { data, error } = await supabase
        .from("parcels")
        .select("*, clients ( full_name ), collection_centres (name)")
        .not("collection_datetime", "is", null);
    if (error) {
        throw new Error("Database error");
    }
    return data;
};

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
