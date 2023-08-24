"use client";

import React from "react";
import supabase from "@/supabaseClient";
import DayOverviewButton from "@/components/DayOverview/DayOverviewButton";
import { Schema } from "@/database_utils";

interface Props {
    text: string;
    date: Date;
    collectionCentreKey: string;
}

export type ParcelOfSpecificDateAndLocation = Pick<Schema["parcels"], "collection_datetime"> & {
    clients: Pick<
        Schema["clients"],
        "flagged_for_attention" | "full_name" | "address_postcode" | "delivery_instructions"
    > | null;
};

export interface DayOverviewData {
    date: Date;
    location: string;
    data: ParcelOfSpecificDateAndLocation[];
}

type CollectionCentreNameAndAbbreviation = Pick<Schema["collection_centres"], "name" | "acronym">;

export const getCurrentDate = (date: Date, hyphen: boolean = false): string => {
    const formattedDate = date.toLocaleString("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });

    return hyphen ? formattedDate : formattedDate.replaceAll("-", "");
};

const getParcelsOfSpecificDateAndLocation = async (
    date: Date,
    collectionCentreKey: string
): Promise<ParcelOfSpecificDateAndLocation[]> => {
    const startDateString = date.toISOString();
    const endDate = new Date(date);
    endDate.setDate(date.getDate() + 1);
    const endDateString = endDate.toISOString();

    const { data } = await supabase
        .from("parcels")
        .select(
            `collection_datetime, 
            clients ( 
                flagged_for_attention, 
                full_name, 
                address_postcode, 
                delivery_instructions
            )`
        )
        .gte("collection_datetime", startDateString)
        .lt("collection_datetime", endDateString)
        .eq("collection_centre", collectionCentreKey)
        .order("collection_datetime");

    // TODO VFB-22 Check if error message is consistent

    if (!data) {
        throw new Error(
            "We were unable to fetch the parcels with the specified collection date and location."
        );
    }

    return data;
};

const fetchCollectionCentreNameAndAbbreviation = async (
    collectionCentreKey: string
): Promise<CollectionCentreNameAndAbbreviation> => {
    const { data } = await supabase
        .from("collection_centres")
        .select("name, acronym")
        .eq("primary_key", collectionCentreKey)
        .limit(1);

    // TODO VFB-22 Check if error message is consistent

    if (!data) {
        throw new Error(
            "We were unable to fetch the collection centre data. Please try again later"
        );
    }

    return data[0];
};

const DayOverview = async ({
    text,
    date,
    collectionCentreKey,
}: Props): Promise<React.ReactElement> => {
    const [collectionCentreNameAndAbbreviation, parcelsOfSpecificDate] = await Promise.all([
        fetchCollectionCentreNameAndAbbreviation(collectionCentreKey),
        getParcelsOfSpecificDateAndLocation(date, collectionCentreKey),
    ]);

    const dateString = getCurrentDate(date);

    const fileName = `DayOverview_${dateString}_${collectionCentreNameAndAbbreviation?.acronym}.pdf`;
    const data: DayOverviewData = {
        date: date,
        location: collectionCentreNameAndAbbreviation?.name,
        data: parcelsOfSpecificDate,
    };

    return <DayOverviewButton data={data} text={text} fileName={fileName} />;
};

export default DayOverview;
