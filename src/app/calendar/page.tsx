import { Metadata } from "next";
import React from "react";
import ParcelCalendar from "@/app/calendar/ParcelCalendar";
import { ParcelsWithExtraFields } from "@/app/calendar/parcelCalendarFunctions";
import { Schema } from "@/databaseUtils";
import supabase from "@/supabaseServer";
import { DatabaseError } from "@/app/errorClasses";

export const revalidate = 0;

const getCollectionCentres = async (): Promise<Schema["collection_centres"]["name"][]> => {
    const { data, error } = await supabase.from("collection_centres").select("name");
    if (error) {
        throw new Error("Database error");
    }
    const mappedValues = data.map((centre) => centre.name);
    return mappedValues.filter((centre) => centre !== "Delivery");
};

const getParcelsWithCollectionDate = async (): Promise<ParcelsWithExtraFields[]> => {
    const { data, error } = await supabase
        .from("parcels")
        .select(
            `
            *, 
            clients (
                full_name
            ), 
            collection_centres (
                name
            )
        `
        )
        .not("collection_datetime", "is", null);

    if (error) {
        throw new DatabaseError("fetch", "user information");
    }

    return data;
};

const CalendarPage = async (): Promise<React.ReactElement> => {
    const parcelsWithCollectionDate = await getParcelsWithCollectionDate();
    const collectionCentres = await getCollectionCentres();

    return (
        <main>
            <ParcelCalendar
                parcelsWithCollectionDate={parcelsWithCollectionDate}
                collectionCentres={collectionCentres}
            />
        </main>
    );
};

export const metadata: Metadata = {
    title: "Calendar",
};

export default CalendarPage;
