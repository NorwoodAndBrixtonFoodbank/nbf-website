import supabase from "@/supabaseClient";
import { DatabaseError } from "@/app/errorClasses";
import { Data } from "@/components/DataViewer/DataViewer";
import { formatDatetimeAsDate, formatDatetimeAsTime } from "@/app/parcels/getExpandedParcelDetails";

export type RawClientParcelsDetails = Awaited<ReturnType<typeof getRawClientParcelsDetails>>;
type ClientParcelDetails = RawClientParcelsDetails[number];
export const getExpandedClientParcelsDetails = async (
    clientId: string
): Promise<ExpandedClientParcelDetails[]> => {
    const rawClientParcelsDetails = await getRawClientParcelsDetails(clientId);
    const formattedList = rawClientParcelsDetails.map((parcel) => {
        return rawDataToExpandedClientParcelsDetails(parcel);
    });
    return formattedList;
};
const getRawClientParcelsDetails = async (clientId: string) => {
    const { data, error } = await supabase
        .from("parcels")
        .select(
            `
        parcel_id:primary_key,
        
        collection_centre:collection_centres ( 
            name, 
            acronym
         ),
         
        collection_datetime,
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
    packingTime: string;
    collection: string;
}

export const rawDataToExpandedClientParcelsDetails = (
    parcel: ClientParcelDetails
): ExpandedClientParcelDetails => {
    return {
        parcelId: parcel.parcel_id,
        voucherNumber: parcel.voucher_number ?? "-",
        packingDate: formatDatetimeAsDate(parcel.packing_datetime),
        packingTime: formatDatetimeAsTime(parcel.packing_datetime),
        collection: parcel.collection_centre?.name ?? "-",
    };
};
