import { Metadata } from "next";
import React from "react";
import ParcelCalendar from "@/app/calendar/ParcelCalendar";
import supabase from "@/supabaseServer";
import { ParcelsWithExtraFields } from "@/app/calendar/parcelCalendarFunctions";

export const dynamic = "force-dynamic";

const getParcelsWithCollectionDate = async (): Promise<ParcelsWithExtraFields[]> => {
    const { data, error } = await supabase
        .from("parcels")
        .select("*, clients ( full_name ), collection_centres ( name )")
        .not("collection_datetime", "is", null);
    if (error) {
        throw new Error("Database error");
    }
    return data;
};

const getCollectionCentres = async (): Promise<string[]> => {
    const { data, error } = await supabase.from("collection_centres").select("name");
    if (error) {
        throw new Error("Database error");
    }
    const mappedValues = data.map((centre) => centre.name);
    return mappedValues.filter((centre) => centre !== "Delivery");
};

const CalendarPage = async (): Promise<React.ReactElement> => {
    const values = await Promise.all([getParcelsWithCollectionDate(), getCollectionCentres()]);
    return (
        <main>
            <ParcelCalendar parcelsWithCollectionDate={values[0]} collectionCentres={values[1]} />
        </main>
    );
};

export const metadata: Metadata = {
    title: "Calendar",
};

export default CalendarPage;
