import { fetchParcel } from "@/common/fetch";
import supabase from "@/supabaseClient";

export interface ParcelInfo {
    voucherNumber: string;
    packingDate: string;
    packingSlot: string;
    collectionDate: string;
    collectionSite: string;
}

interface ParcelInfoAndClientID {
    parcelInfo: ParcelInfo;
    clientID: string;
}

const formatDateToDateTime = (dateString: string | null): string => {
    if (dateString === null) {
        return "";
    }
    return new Date(dateString).toLocaleString("en-GB", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
    });
};

const formatDateToDate = (dateString: string | null): string => {
    if (dateString === null) {
        return "";
    }
    return new Date(dateString).toLocaleString("en-GB", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
    });
};

export const prepareParcelInfo = async (parcelID: string): Promise<ParcelInfoAndClientID> => {
    const fetchedData = await fetchParcel(parcelID, supabase);
    const parcelInfo: ParcelInfo = {
        voucherNumber: fetchedData.voucher_number ?? "",
        packingDate: formatDateToDate(fetchedData.packing_date) ?? "",
        packingSlot: fetchedData.packing_slot?.name ?? "",
        collectionDate: formatDateToDateTime(fetchedData.collection_datetime),
        collectionSite: fetchedData.collection_centre?.name ?? "",
    };
    if (parcelInfo.collectionSite === "Delivery") {
        parcelInfo.collectionSite = "N/A - Delivery";
    }

    return { parcelInfo: parcelInfo, clientID: fetchedData.client_id };
};
