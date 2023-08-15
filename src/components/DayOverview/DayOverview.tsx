import React from "react";
import supabase, { Schema } from "@/supabase";
import DayOverviewButton from "@/components/DayOverview/DayOverviewButton";

export type ParcelOfSpecificDateLocation = {
    collection_datetime: Schema["parcels"]["collection_datetime"];
    clients: {
        flagged_for_attention: Schema["clients"]["flagged_for_attention"];
        full_name: Schema["clients"]["full_name"];
        address_postcode: Schema["clients"]["address_postcode"];
        delivery_instructions: Schema["clients"]["delivery_instructions"];
    } | null;
};

export const getParcelsOfSpecificDateLocation = async (
    date: Date,
    collectionCentre: string
): Promise<ParcelOfSpecificDateLocation[]> => {
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

interface Props {
    text: string;
}

const DayOverview = async ({ text }: Props): Promise<React.ReactElement> => {
    const date = new Date("2023-07-17");
    const location = "Delivery";
    const parcelsOfSpecificDate = await getParcelsOfSpecificDateLocation(date, location);

    return (
        <main>
            <DayOverviewButton
                date={date}
                location={location}
                data={parcelsOfSpecificDate}
                text={text}
            />
        </main>
    );
};

export default DayOverview;
