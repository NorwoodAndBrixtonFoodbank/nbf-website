"use client";

import React from "react";
import supabase from "@/supabaseClient";
import { Schema } from "@/databaseUtils";
import PdfButton from "@/components/PdfButton/PdfButton";
import DayOverviewPdf from "./DayOverviewPdf";
import { logErrorReturnLogId } from "@/logger/logger";
import { PdfDataFetchResponse } from "../common";
import { ParcelsTableRow } from "@/app/parcels/getParcelsTableData";
import { addCongestionChargeDetailsForDayOverview } from "@/app/congestionCharges";

interface Props {
    onPdfCreationCompleted: () => void;
    onPdfCreationFailed: (error: DayOverviewPdfError) => void;
    parcels: ParcelsTableRow[];
}

export type ParcelForDayOverview = Pick<Schema["parcels"], "collection_datetime"> & {
    client: Pick<
        Schema["clients"],
        "flagged_for_attention" | "full_name" | "address_postcode" | "delivery_instructions"
    > | null;
    collection_centre: Pick<Schema["collection_centres"], "name"> | null;
    congestionChargeApplies?: boolean;
};

type ParcelForDayOverviewResponse =
    | {
          data: ParcelForDayOverview[];
          error: null;
      }
    | {
          data: null;
          error: { type: ParcelForDayOverviewErrorType; logId: string };
      };

type ParcelForDayOverviewErrorType = "parcelFetchFailed";

const getParcelsForDayOverview = async (
    parcelIds: string[]
): Promise<ParcelForDayOverviewResponse> => {
    const { data, error } = await supabase
        .from("parcels")
        .select(
            `collection_datetime, 
            collection_centre:collection_centres(name),
            client:clients ( 
                flagged_for_attention, 
                full_name, 
                address_postcode, 
                delivery_instructions
            )`
        )
        .in("primary_key", parcelIds)
        .order("collection_datetime");

    if (error) {
        const logId = await logErrorReturnLogId("Error with fetch: Parcel", error);
        return { data: null, error: { type: "parcelFetchFailed", logId: logId } };
    }

    return { data: data, error: null };
};
export interface DayOverviewPdfData {
    parcels: ParcelForDayOverview[];
}

type DayOverviewPdfErrorType = ParcelForDayOverviewErrorType;
export type DayOverviewPdfError = { type: DayOverviewPdfErrorType; logId: string };

const DayOverviewPdfButton = ({
    onPdfCreationCompleted,
    onPdfCreationFailed,
    parcels,
}: Props): React.ReactElement => {
    const fetchDataAndFileName = async (): Promise<
        PdfDataFetchResponse<DayOverviewPdfData, DayOverviewPdfErrorType>
    > => {
        const parcelIds = parcels.map((parcel) => {
            return parcel.parcelId;
        });
        const { data: parcelsForDayOverview, error: error } =
            await getParcelsForDayOverview(parcelIds);
        if (error) {
            return { data: null, error: error };
        }
        
        const parcelsForDayOverviewWithCongestionChargeDetails = await addCongestionChargeDetailsForDayOverview(parcelsForDayOverview);

        const fileName = "DayOverview.pdf";
        return {
            data: {
                pdfData: {
                    parcels: parcelsForDayOverviewWithCongestionChargeDetails,
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
        />
    );
};

export default DayOverviewPdfButton;
