import React from "react";
import supabase from "@/supabaseClient";
import { Schema } from "@/database_utils";
import PdfButton from "@/components/PdfButton/PdfButton";
import ShippingLabelsPdf, { ParcelClients } from "@/pdf/ShippingLabels/ShippingLabelsPdf";
import { DatabaseError } from "@/app/errorClasses";

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

    const formattedDate = isDatetime
        ? new Date(datetimeString).toLocaleString([], dateOptions)
        : new Date(datetimeString).toLocaleDateString();

    return formattedDate;
};

const getParcelsForDelivery = async (parcelIds: string[]): Promise<Schema["parcels"][]> => {
    const { data, error } = await supabase.from("parcels").select("*").in("primary_key", parcelIds);
    if (error !== null) {
        throw new DatabaseError("fetch", " delivery parcels data");
    }
    return data ?? [];
};

const getClientById = async (clientId: string): Promise<Schema["clients"] | null> => {
    const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("primary_key", clientId)
        .single();
    if (error !== null) {
        throw new DatabaseError("fetch", "correct client");
    }
    return data ?? null;
};

const getRequiredData = async (parcelIds: string[]): Promise<ParcelClients[]> => {
    const parcels = await getParcelsForDelivery(parcelIds);

    return await Promise.all(
        parcels.map(async (parcel) => {
            const client = await getClientById(parcel.client_id);
            return {
                packing_datetime: formatDatetime(parcel.packing_datetime, false),
                collection_centre: parcel.collection_centre ?? "",
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
        })
    );
};

interface Props {
    text: string;
    parcelIds: string[];
}

const ShippingLabels = async ({ text, parcelIds }: Props): Promise<React.ReactElement> => {
    const requiredData = await getRequiredData(parcelIds);
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
