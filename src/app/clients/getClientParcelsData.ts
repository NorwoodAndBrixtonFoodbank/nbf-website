import supabase from "@/supabaseClient";
import { DatabaseError } from "@/app/errorClasses";
import { Data } from "@/components/DataViewer/DataViewer";
import { formatDatetimeAsDate } from "@/app/parcels/getExpandedParcelDetails";

export type RawClientParcelsDetails = Awaited<ReturnType<typeof getRawClientParcelsDetails>>;

type ClientParcelDetails = RawClientParcelsDetails[number];

export interface ParcelsDetail {
    parcel_id: string;
    collection_centre?: { name: string } | null;
    packing_datetime: string | null;
    voucher_number?: string | null;
}

export const getClientParcelsDetails = async (
    clientId: string
): Promise<ExpandedClientParcelDetails[]> => {
    const rawClientParcelsDetails = await getRawClientParcelsDetails(clientId);
    const formattedList = rawClientParcelsDetails.map(rawDataToClientParcelsDetails);
    return formattedList;
};

const getRawClientParcelsDetails = async (clientId: string): Promise<ParcelsDetail[]> => {
    const { data, error } = await supabase
        .from("parcels")
        .select(
            `
        parcel_id:primary_key,
        collection_centre:collection_centres ( 
            name
         ),
        packing_datetime,
        voucher_number
    `
        )
        .eq("client_id", clientId)
        .order("packing_datetime", { ascending: false });

    if (error) {
        throw new DatabaseError("fetch", "parcel table data");
    }

    return data ?? [];
};

export interface ExpandedClientParcelDetails extends Data {
    parcelId: string;
    voucherNumber: string;
    packingDate: string;
    collectionCentre: string;
}

export const rawDataToClientParcelsDetails = (
    parcel: ClientParcelDetails
): ExpandedClientParcelDetails => {
    return {
        parcelId: parcel.parcel_id,
        voucherNumber: parcel.voucher_number ?? "-",
        packingDate: formatDatetimeAsDate(parcel.packing_datetime),
        collectionCentre: parcel.collection_centre?.name ?? "-",
    };
};
