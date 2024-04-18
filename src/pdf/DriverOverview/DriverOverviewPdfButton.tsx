"use client";

import React from "react";
import supabase from "@/supabaseClient";
import { Schema } from "@/databaseUtils";
import PdfButton from "@/components/PdfButton/PdfButton";
import DriverOverviewPdf, { DriverOverviewTableData } from "@/pdf/DriverOverview/DriverOverviewPdf";
import { logErrorReturnLogId } from "@/logger/logger";
import { formatDateToDate } from "@/common/format";
import { Dayjs } from "dayjs";
import { ParcelsTableRow } from "@/app/parcels/getParcelsTableData";
import { PdfDataFetchResponse } from "../common";

interface DriverOverviewData {
    driverName: string;
    date: Date;
    tableData: DriverOverviewTableData[];
    message: string;
}

const compareDriverOverviewTableData = (
    first: DriverOverviewTableData,
    second: DriverOverviewTableData
): number => {
    if (first.name < second.name) {
        return -1;
    }
    if (first.name > second.name) {
        return 1;
    }
    return 0;
};

type ParcelsForDelivery = ((Schema["parcels"] & {client: Schema["clients"]}))[]

type ParcelsForDeliveryResponse =
    | {
          data: ParcelsForDelivery;
          error: null;
      }
    | {
          data: null;
          error: { type: ParcelsForDeliveryErrorType; logId: string };
      };

type ParcelsForDeliveryErrorType = "parcelFetchFailed" | "noMatchingClient";

const getParcelsForDelivery = async (parcelIds: string[]): Promise<ParcelsForDeliveryResponse> => {
    const {data, error} = await supabase.from("parcels").select("*, client:clients(*)").in("primary_key", parcelIds).limit(1, {foreignTable: "clients"});
    if (error) {
        const logId = await logErrorReturnLogId("Error with fetch: Parcels", error);
        return { data: null, error: { type: "parcelFetchFailed", logId: logId } };
    }

    const dataWithNonNullClients: ParcelsForDelivery = []
    for (const parcel of data) {
        if (parcel.client === null) {
            const logId = await logErrorReturnLogId("Error with fetch: Parcels. No matching client found",);
            return { data: null, error: { type: "noMatchingClient", logId: logId } };
        }
        dataWithNonNullClients.push ({...parcel, client: parcel.client})
    }

    return { data: dataWithNonNullClients, error: null };
};

type DriverPdfResponse =
    | {
          data: DriverOverviewTableData[];
          error: null;
      }
    | {
          data: null;
          error: { type: DriverPdfErrorType; logId: string };
      };

type DriverPdfErrorType = ParcelsForDeliveryErrorType;

const getDriverPdfData = async (parcelIds: string[]): Promise<DriverPdfResponse> => {
    const clientInformation = [];
    const { data: parcels, error: parcelsError } = await getParcelsForDelivery(parcelIds);
    if (parcelsError) {
        return { data: null, error: parcelsError };
    }
    for (const parcel of parcels) {
        const client = parcel.client;
        clientInformation.push({
            name: client?.full_name ?? "",
            address: {
                line1: client?.address_1 ?? "",
                line2: client?.address_2 ?? null,
                town: client?.address_town ?? null,
                county: client?.address_county ?? null,
                postcode: client?.address_postcode ?? "",
            },
            contact: client?.phone_number ?? "",
            packingDate: formatDateToDate(parcel.packing_date) ?? null,
            instructions: client?.delivery_instructions ?? "",
        });
    }
    clientInformation.sort(compareDriverOverviewTableData);
    return { data: clientInformation, error: null };
};

interface Props {
    text: string;
    parcels: ParcelsTableRow[];
    driverName: string;
    date: Dayjs;
    onPdfCreationCompleted: () => void;
    onPdfCreationFailed: (error: DriverOverviewError) => void;
    disabled: boolean;
}

export type DriverOverviewErrorType = DriverPdfErrorType | "driverMessageFetchFailed";
export type DriverOverviewError = { type: DriverOverviewErrorType; logId: string };

const DriverOverviewPdfButton = ({
    text,
    parcels,
    driverName,
    date,
    onPdfCreationCompleted,
    onPdfCreationFailed,
    disabled,
}: Props): React.ReactElement => {
    const fetchDataAndFileName = async (): Promise<
        PdfDataFetchResponse<DriverOverviewData, DriverOverviewErrorType>
    > => {
        const parcelIds = parcels.map((parcel) => {
            return parcel.parcelId;
        });
        const { data: driverPdfData, error: driverPdfError } = await getDriverPdfData(parcelIds);
        if (driverPdfError) {
            return { data: null, error: driverPdfError };
        }
        const { data: driverMessageData, error: driverMessageError } = await supabase
            .from("website_data")
            .select("name, value")
            .eq("name", "driver_overview_message")
            .single();
        if (driverMessageError) {
            const logId = await logErrorReturnLogId("Error with fetch: Driver overview message", {
                driverMessageError,
            });
            return { data: null, error: { type: "driverMessageFetchFailed", logId: logId } };
        }
        return {
            data: {
                pdfData: {
                    driverName: driverName,
                    date: date.toDate(),
                    tableData: driverPdfData,
                    message: driverMessageData.value,
                },
                fileName: "DriverOverview.pdf",
            },
            error: null,
        };
    };
    return (
        <PdfButton
            text={text}
            fetchDataAndFileName={fetchDataAndFileName}
            pdfComponent={DriverOverviewPdf}
            onPdfCreationCompleted={onPdfCreationCompleted}
            onPdfCreationFailed={onPdfCreationFailed}
            disabled={disabled}
        />
    );
};

export default DriverOverviewPdfButton;
