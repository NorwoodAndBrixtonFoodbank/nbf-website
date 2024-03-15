import { Metadata } from "next";
import React from "react";
import ParcelCalendar from "@/app/calendar/ParcelCalendar";
import { ParcelsWithExtraFields } from "@/app/calendar/parcelCalendarFunctions";
import { Schema } from "@/databaseUtils";
import { getSupabaseServerComponentClient } from "@/supabaseServer";
import { DatabaseError } from "@/app/errorClasses";
import { logError } from "@/logger/logger";

export const revalidate = 0;

const getCollectionCentres = async (): Promise<Schema["collection_centres"]["name"][]> => {
    const supabase = getSupabaseServerComponentClient();
    const { data, error } = await supabase.from("collection_centres").select("name");
    if (error) {
        const response = logError("Error with fetch: Collection centre names", error);
        response.then((errorId) => {
            throw new DatabaseError("fetch", "collection centre names", errorId);
        });
    }
    const mappedValues = data ? data.map((centre) => centre.name) : [];
    return mappedValues.filter((centre) => centre !== "Delivery");
};

const getParcelsWithCollectionDate = async (): Promise<ParcelsWithExtraFields[]> => {
    const supabase = getSupabaseServerComponentClient();
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
        const response = logError("Error with fetch: Parcels with extra fields", error);
        response.then((errorId) => {
            throw new DatabaseError("fetch", "parcels with user information", errorId);
        });
    }

    return data ? data : [];
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
