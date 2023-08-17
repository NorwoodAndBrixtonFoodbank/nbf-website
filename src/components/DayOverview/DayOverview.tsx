import React from "react";
import supabase, { Schema } from "@/supabase";
import DayOverviewButton from "@/components/DayOverview/DayOverviewButton";

interface Props {
    text: string;
    date: Date;
    location: string;
}

export type ParcelOfSpecificDateAndLocation = {
    collection_datetime: Schema["parcels"]["collection_datetime"];
    clients: Pick<
        Schema["clients"],
        "flagged_for_attention" | "full_name" | "address_postcode" | "delivery_instructions"
    > | null;
};

export type DayOverviewData = {
    date: Date;
    location: string;
    data: ParcelOfSpecificDateAndLocation[];
};

export const getCurrentDate = (date: Date, hyphen: boolean = false): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    return hyphen ? `${year}-${month}-${day}` : `${year}${month}${day}`;
};

const getParcelsOfSpecificDateAndLocation = async (
    date: Date,
    collectionCentre: string
): Promise<ParcelOfSpecificDateAndLocation[]> => {
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
        throw new Error(`Database error - ${error.message}`);
    }

    return data;
};

const collectionCentreToAbbreviation = (
    collectionCentre: Schema["parcels"]["collection_centre"]
): string => {
    switch (collectionCentre) {
        case "Brixton Hill - Methodist Church":
            return "BH_MC";
        case "Clapham - St Stephens Church":
            return "CLP_SC";
        case "N&B - Emmanuel Church":
            return "NAB_EC";
        case "Streatham - Immanuel & St Andrew":
            return "STM_IS";
        case "Vauxhall Hope Church":
            return "VHC";
        case "Waterloo - Oasis":
            return "WAT_OA";
        case "Waterloo - St George the Martyr":
            return "WAT_SG";
        case "Waterloo - St Johns":
            return "WAT_SJ";
        case "Delivery":
            return "Delivery";
        default:
            throw new Error("Invalid location");
    }
};

const DayOverview = async ({ text, date, location }: Props): Promise<React.ReactElement> => {
    const parcelsOfSpecificDate = await getParcelsOfSpecificDateAndLocation(date, location);
    const dateString = getCurrentDate(date);
    const fileName = `DayOverview_${dateString}_${collectionCentreToAbbreviation(location)}.pdf`;
    const data = {
        date: date,
        location: location,
        data: parcelsOfSpecificDate,
    };

    return <DayOverviewButton data={data} text={text} fileName={fileName} />;
};

export default DayOverview;
