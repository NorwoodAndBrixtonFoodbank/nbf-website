import React from "react";
import supabase from "@/supabaseClient";
import { Schema } from "@/database_utils";
import PdfButton from "@/components/PdfButton/PdfButton";
import DayOverviewPdf from "./DayOverviewPdf";

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

    const { data, error } = await supabase
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

    if (error) {
        throw new Error(
            "We were unable to fetch the parcels with the specified collection date and location."
        );
    }

    return data;
};

const fetchCollectionCentreNameAndAbbreviation = async (
    collectionCentreKey: string
): Promise<CollectionCentreNameAndAbbreviation> => {
    const { data, error } = await supabase
        .from("collection_centres")
        .select()
        .eq("primary_key", collectionCentreKey)
        .maybeSingle();

    // TODO VFB-22 Check if error message is consistent

    if (error) {
        throw new Error(
            "We were unable to fetch the collection centre data. Please try again later"
        );
    }

    return data!;
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

    const acronym = `_${collectionCentreNameAndAbbreviation?.acronym}` ?? "";
    const location = collectionCentreNameAndAbbreviation?.name ?? "";

    const fileName = `DayOverview_${dateString}${acronym}.pdf`;
    const data: DayOverviewData = {
        date: date,
        location: location,
        data: parcelsOfSpecificDate,
    };

    return <PdfButton text={text} fileName={fileName} data={data} pdfComponent={DayOverviewPdf} />;
};

export default DayOverview;
