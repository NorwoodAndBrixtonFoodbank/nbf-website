import React from "react";
import supabase, { Schema } from "@/supabase";
import DayOverviewButton from "@/components/DayOverview/DayOverviewButton";

interface Props {
    text: string;
}

export type ParcelOfSpecificDateLocation = {
    collection_datetime: Schema["parcels"]["collection_datetime"];
    clients: Pick<
        Schema["clients"],
        "flagged_for_attention" | "full_name" | "address_postcode" | "delivery_instructions"
    > | null;
};

const getParcelsOfSpecificDateAndLocation = async (
    date: Date,
    collectionCentre: string
): Promise<ParcelOfSpecificDateLocation[]> => {
    const startDateString = date.toISOString();
    const endDate = new Date(date);
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

const DayOverview = async ({ text }: Props): Promise<React.ReactElement> => {
    const date = new Date("2023-07-17");
    const location = "Delivery";
    const parcelsOfSpecificDate = await getParcelsOfSpecificDateAndLocation(date, location);

    return (
        <DayOverviewButton
            date={date}
            location={location}
            data={parcelsOfSpecificDate}
            text={text}
        />
    );
};

export default DayOverview;
