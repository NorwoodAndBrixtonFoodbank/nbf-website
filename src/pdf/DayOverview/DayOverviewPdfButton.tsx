"use client";

import React from "react";
import supabase from "@/supabaseClient";
import { Schema } from "@/databaseUtils";
import PdfButton from "@/components/PdfButton/PdfButton";
import DayOverviewPdf from "./DayOverviewPdf";
import { DatabaseError } from "@/app/errorClasses";
import { logErrorReturnLogId } from "@/logger/logger";
import { Dayjs } from "dayjs";

interface Props {
    text: string;
    date: Dayjs;
    collectionCentreKey: string | null;
    onClick: () => void;
    disabled: boolean;
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
        const logId = await logErrorReturnLogId("Error with fetch: Parcel", error);
        throw new DatabaseError("fetch", "parcel", logId);
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

    if (error) {
        const logId = await logErrorReturnLogId("Error with fetch: Collection centre", error);
        throw new DatabaseError("fetch", "collection centre", logId);
    }

    return data!;
};

const DayOverviewPdfButton = ({
    text,
    date: dayjsDate,
    collectionCentreKey,
    onClick,
    disabled,
}: Props): React.ReactElement => {
    const fetchDataAndFileName = async (): Promise<{ data: DayOverviewData; fileName: string }> => {
        const date = dayjsDate.toDate();
        const collectionCentreNameAndAbbreviation = await fetchCollectionCentreNameAndAbbreviation(
            collectionCentreKey!
        );
        const parcelsOfSpecificDate = await getParcelsOfSpecificDateAndLocation(
            date,
            collectionCentreKey!
        );
        const dateString = getCurrentDate(date);

        const acronym = `_${collectionCentreNameAndAbbreviation?.acronym}` ?? "";
        const location = collectionCentreNameAndAbbreviation?.name ?? "";

        const fileName = `DayOverview_${dateString}${acronym}.pdf`;
        return {
            data: {
                date: date,
                location: location,
                data: parcelsOfSpecificDate,
            },
            fileName: fileName,
        };
    };

    return (
        <PdfButton
            text={text}
            fetchDataAndFileName={fetchDataAndFileName}
            pdfComponent={DayOverviewPdf}
            clickHandler={onClick}
            disabled={disabled}
        />
    );
};

export default DayOverviewPdfButton;
