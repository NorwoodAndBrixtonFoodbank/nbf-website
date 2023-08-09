import { Metadata } from "next";
import React from "react";
import ShippingParcels from "@/app/shippings/shippingParcels";
import { ParcelClients } from "@/app/shippings/parcelCard";
import supabase, { Schema } from "@/supabase";
import Title from "@/components/Title/Title";

const formatDatetime = (datetimeString: string | null, isDatetime: boolean): string => {
    if (datetimeString === null) {
        return "No recorded date";
    }

    const formattedDate = isDatetime
        ? new Date(datetimeString).toLocaleString([], {
              year: "numeric",
              month: "numeric",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
          })
        : new Date(datetimeString).toLocaleDateString();

    return formattedDate;
};

const getParcelsForDelivery = async (): Promise<Schema["parcels"][]> => {
    const response = await supabase
        .from("parcels")
        .select()
        .filter("collection_centre", "eq", "Delivery");
    return response.data ?? [];
};

const getClientById = async (clientId: string): Promise<Schema["clients"] | null> => {
    const response = await supabase
        .from("clients")
        .select("*")
        .eq("primary_key", clientId)
        .single();
    return response.data ?? null;
};

const getRequiredData = async (): Promise<ParcelClients[]> => {
    const parcels = await getParcelsForDelivery();
    return await Promise.all(
        parcels.map(async (parcel) => {
            const client = await getClientById(parcel.client_id);
            return {
                primary_key: parcel.primary_key,
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

const Shippings = async (): Promise<React.ReactElement> => {
    const requiredData = await getRequiredData();

    return (
        <main>
            <Title> Shipping Parcels Information </Title>
            <ShippingParcels data={requiredData} />
        </main>
    );
};

export const metadata: Metadata = {
    title: "Shippings",
};

export default Shippings;
