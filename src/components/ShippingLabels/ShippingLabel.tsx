import React from "react";
import supabase from "@/supabaseServer";
import { Schema } from "@/database_utils";
import ShippingLabelsButton from "@/components/ShippingLabels/ShippingLabelsButton";
import { ParcelClients } from "@/components/ShippingLabels/ShippingLabelsPdf";

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

const format1DTo2DArray = (
    inputArray: ParcelClients[],
    elementsPerSubarray: number
): ParcelClients[][] => {
    const result: ParcelClients[][] = [];
    for (let index = 0; index < inputArray.length; index += elementsPerSubarray) {
        result.push(inputArray.slice(index, index + elementsPerSubarray));
    }
    return result;
};

// TODO make the function query only required data from selected rows in client page
const getParcelsForDelivery = async (): Promise<Schema["parcels"][]> => {
    const { data, error } = await supabase
        .from("parcels")
        .select()
        .filter("collection_centre", "eq", "Delivery");
    if (error !== null) {
        throw Error(`${error.code}: ${error.message}`);
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
        throw Error(`${error.code}: ${error.message}`);
    }
    return data ?? null;
};

const getRequiredData = async (): Promise<ParcelClients[]> => {
    const parcels = await getParcelsForDelivery();
    const total = parcels.length;

    return await Promise.all(
        parcels.map(async (parcel, index) => {
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
                index: index + 1,
                total: total,
            };
        })
    );
};

interface Props {
    text: string;
}

const ShippingsLabel = async ({ text }: Props): Promise<React.ReactElement> => {
    const requiredData = await getRequiredData();
    return <ShippingLabelsButton data={format1DTo2DArray(requiredData, 5)} text={text} />;
};

export default ShippingsLabel;
