"use client";

import React from "react";
import supabase from "@/supabaseClient";
import { Schema } from "@/databaseUtils";
import PdfButton from "@/components/PdfButton/PdfButton";
import DayOverviewPdf from "./DayOverviewPdf";
import { logErrorReturnLogId } from "@/logger/logger";
import { PdfDataFetchResponse } from "../common";

interface Props {
    date: Date;
    collectionCentreKey: string | null;
    onPdfCreationCompleted: () => void;
    onPdfCreationFailed: (error: DayOverviewPdfError) => void;
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

type ParcelsOfSpecificDateAndLocationResponse =
    | {
          data: ParcelOfSpecificDateAndLocation[];
          error: null;
      }
    | {
          data: null;
          error: { type: ParcelsOfSpecificDateAndLocationErrorType; logId: string };
      };

type ParcelsOfSpecificDateAndLocationErrorType = "parcelFetchFailed";

const getParcelsOfSpecificDateAndLocation = async (
    date: Date,
    collectionCentreKey: string
): Promise<ParcelsOfSpecificDateAndLocationResponse> => {
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
        return { data: null, error: { type: "parcelFetchFailed", logId: logId } };
    }

    return { data: data, error: null };
};

type CollectionCentreResponse =
    | {
          data: CollectionCentreNameAndAbbreviation;
          error: null;
      }
    | {
          data: null;
          error: { type: CollectionCentreErrorType; logId: string };
      };

type CollectionCentreErrorType = "collectionCentreFetchFailed" | "noMatchingCollectionCentre";

const fetchCollectionCentreNameAndAbbreviation = async (
    collectionCentreKey: string
): Promise<CollectionCentreResponse> => {
    const { data, error } = await supabase
        .from("collection_centres")
        .select()
        .eq("primary_key", collectionCentreKey)
        .single();

    if (error) {
        const logId = await logErrorReturnLogId("Error with fetch: Collection centre", error);
        return { data: null, error: { type: "collectionCentreFetchFailed", logId: logId } };
    }

    if (!data) {
        const logId = await logErrorReturnLogId("Error with fetch: Collection centre");
        return { data: null, error: { type: "noMatchingCollectionCentre", logId: logId } };
    }

    return { data: data, error: null };
};

interface DayOverviewPdfData {
    date: Date;
    location: string;
    data: ParcelOfSpecificDateAndLocation[];
}

type DayOverviewPdfErrorType =
    | CollectionCentreErrorType
    | ParcelsOfSpecificDateAndLocationErrorType;
export type DayOverviewPdfError = { type: DayOverviewPdfErrorType; logId: string };

const DayOverviewPdfButton = ({
    date,
    collectionCentreKey,
    onPdfCreationCompleted,
    onPdfCreationFailed,
    disabled,
}: Props): React.ReactElement => {
    const fetchDataAndFileName = async (): Promise<
        PdfDataFetchResponse<DayOverviewPdfData, DayOverviewPdfErrorType>
    > => {
        const {
            data: collectionCentreNameAndAbbreviation,
            error: collectionCentreNameAndAbbreviationError,
        } = await fetchCollectionCentreNameAndAbbreviation(collectionCentreKey!);
        if (collectionCentreNameAndAbbreviationError) {
            return { data: null, error: collectionCentreNameAndAbbreviationError };
        }

        const { data: parcelsOfSpecificDate, error: parcelsOfSpecificDateError } =
            await getParcelsOfSpecificDateAndLocation(date, collectionCentreKey!);
        if (parcelsOfSpecificDateError) {
            return { data: null, error: parcelsOfSpecificDateError };
        }

        const dateString = getCurrentDate(date);

        const acronym = `_${collectionCentreNameAndAbbreviation?.acronym}` ?? "";
        const location = collectionCentreNameAndAbbreviation?.name ?? "";

        const fileName = `DayOverview_${dateString}${acronym}.pdf`;
        return {
            data: {
                pdfData: {
                    date: date,
                    location: location,
                    data: parcelsOfSpecificDate,
                },
                fileName: fileName,
            },
            error: null,
        };
    };

    return (
        <PdfButton
            fetchDataAndFileName={fetchDataAndFileName}
            pdfComponent={DayOverviewPdf}
            onPdfCreationCompleted={onPdfCreationCompleted}
            onPdfCreationFailed={onPdfCreationFailed}
            disabled={disabled}
        />
    );
};

export default DayOverviewPdfButton;
