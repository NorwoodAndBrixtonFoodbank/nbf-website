"use client";

import React from "react";
import supabase from "@/supabaseClient";
import PdfButton from "@/components/PdfButton/PdfButton";
import ShippingLabelsPdf, { ShippingLabelData } from "@/pdf/ShippingLabels/ShippingLabelsPdf";
import {
    FetchClientErrorType,
    FetchParcelErrorType,
    fetchClient,
    fetchParcel,
} from "@/common/fetch";
import { ParcelsTableRow } from "@/app/parcels/getParcelsTableData";
import { PdfDataFetchResponse } from "../common";

const formatDatetime = (datetimeString: string | null): string => {
    if (datetimeString === null) {
        return "No recorded date";
    }

    const dateOptions: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    };

    return new Date(datetimeString).toLocaleString([], dateOptions);
};

type ShippingLabelResponse =
    | {
          data: ShippingLabelData;
          error: null;
      }
    | {
          data: null;
          error: ShippingLabelError;
      };

type ShippingLabelErrorType = FetchParcelErrorType | FetchClientErrorType;

export interface ShippingLabelError {
    type: ShippingLabelErrorType;
    logId: string;
}

const getRequiredData = async (
    parcelId: string,
    labelQuantity: number
): Promise<ShippingLabelResponse> => {
    const { data: parcel, error: parcelError } = await fetchParcel(parcelId, supabase);
    if (parcelError) {
        return { data: null, error: parcelError };
    }
    const { data: client, error: clientError } = await fetchClient(parcel.client_id, supabase);
    if (clientError) {
        return { data: null, error: clientError };
    }

    return {
        data: {
            label_quantity: labelQuantity,
            parcel_id: parcelId,
            packing_slot: parcel.packing_slot?.name ?? "",
            collection_centre: parcel.collection_centre?.acronym ?? "",
            collection_datetime: formatDatetime(parcel.collection_datetime),
            voucher_number: parcel.voucher_number ?? "",
            full_name: client.full_name,
            phone_number: client.phone_number,
            address_1: client.address_1,
            address_2: client.address_2,
            address_town: client.address_town,
            address_county: client.address_county,
            address_postcode: client.address_postcode,
            delivery_instructions: client.delivery_instructions,
        },
        error: null,
    };
};

interface Props {
    text: string;
    parcel: ParcelsTableRow;
    labelQuantity: number;
    onPdfCreationCompleted: () => void;
    disabled: boolean;
    onPdfCreationFailed: (error: ShippingLabelError) => void;
}

const ShippingLabelsPdfButton = ({
    text,
    parcel,
    labelQuantity,
    onPdfCreationCompleted,
    disabled,
    onPdfCreationFailed,
}: Props): React.ReactElement => {
    const fetchDataAndFileName = async (): Promise<
        PdfDataFetchResponse<ShippingLabelData, ShippingLabelErrorType>
    > => {
        const parcelId = parcel.parcelId;
        const { data: requiredData, error } = await getRequiredData(parcelId, labelQuantity);
        if (error) {
            return { data: null, error };
        }
        return { data: { pdfData: requiredData, fileName: "ShippingLabels.pdf" }, error: null };
    };

    return (
        <PdfButton
            text={text}
            fetchDataAndFileName={fetchDataAndFileName}
            pdfComponent={ShippingLabelsPdf}
            onPdfCreationCompleted={onPdfCreationCompleted}
            disabled={disabled}
            onPdfCreationFailed={onPdfCreationFailed}
        />
    );
};

export default ShippingLabelsPdfButton;
