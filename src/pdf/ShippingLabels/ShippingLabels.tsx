import React from "react";
import supabase from "@/supabaseClient";
import PdfButton from "@/components/PdfButton/PdfButton";
import ShippingLabelsPdf, { ShippingLabelData } from "@/pdf/ShippingLabels/ShippingLabelsPdf";
import { fetchClient, fetchParcel } from "@/common/fetch";

const formatDatetime = (datetimeString: string | null, isDatetime: boolean): string => {
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

    return isDatetime
        ? new Date(datetimeString).toLocaleString([], dateOptions)
        : new Date(datetimeString).toLocaleDateString();
};

const getRequiredData = async (
    parcelId: string,
    labelQuantity: number
): Promise<ShippingLabelData> => {
    const parcel = await fetchParcel(parcelId, supabase);
    const client = await fetchClient(parcel.client_id, supabase);

    return {
        label_quantity: labelQuantity,
        parcel_id: parcelId,
        packing_slot: parcel.packing_slot?.name ?? "",
        collection_centre: parcel.collection_centre?.acronym ?? "",
        collection_datetime: formatDatetime(parcel.collection_datetime, true),
        voucher_number: parcel.voucher_number ?? "",
        full_name: client?.full_name,
        phone_number: client?.phone_number,
        address_1: client?.address_1,
        address_2: client?.address_2,
        address_town: client?.address_town,
        address_county: client?.address_county,
        address_postcode: client?.address_postcode,
        delivery_instructions: client?.delivery_instructions,
    };
};

interface Props {
    text: string;
    parcelId: string;
    labelQuantity: number;
}

const ShippingLabels = async ({
    text,
    parcelId,
    labelQuantity,
}: Props): Promise<React.ReactElement> => {
    const requiredData = await getRequiredData(parcelId, labelQuantity);
    requiredData.label_quantity = labelQuantity;

    return (
        <PdfButton
            text={text}
            fileName="ShippingLabels.pdf"
            data={requiredData}
            pdfComponent={ShippingLabelsPdf}
        />
    );
};

export default ShippingLabels;
