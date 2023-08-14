import React from "react";
import supabase, { Schema } from "@/supabase";
import DayOverviewerButton from "@/components/DayOverview/DayOverviewerButton";

export type ParcelOfSpecificDate = {
    collection_datetime: string;
    clients: {
        flagged_for_attention: Schema["clients"]["flagged_for_attention"];
        full_name: Schema["clients"]["full_name"];
        address_postcode: Schema["clients"]["address_postcode"];
        delivery_instructions: Schema["clients"]["delivery_instructions"];
    };
};

export const getParcelsOfSpecificDate = async (
    date: Date,
    collectionCentre: string
): Promise<ParcelOfSpecificDate[]> => {
    const startDateString = date.toISOString();
    const endDate = new Date();
    endDate.setDate(date.getDate() + 1);
    const endDateString = endDate.toISOString();

    const { data, error } = await supabase
        .from("parcels")
        .select(
            "collection_datetime, clients(flagged_for_attention, full_name, address_postcode, delivery_instructions)"
        )
        .gte("collection_datetime", startDateString)
        .lt("collection_datetime", endDateString)
        .eq("collection_centre", collectionCentre)
        .order("collection_datetime");

    if (error) {
        throw new Error(`Database error: ${JSON.stringify(error)}`);
    }

    return data;
};

const DayOverviewer = async (): Promise<React.ReactElement> => {
    const date = new Date("2023-07-17");
    const location = "Delivery";
    const parcelsOfSpecificDate = await getParcelsOfSpecificDate(date, location);

    return (
        <main>
            <h1> TempPDF Page </h1>
            <p> Testing PDF </p>
            <DayOverviewerButton date={date} location={location} data={parcelsOfSpecificDate} />
        </main>
    );
};

export default DayOverviewer;
