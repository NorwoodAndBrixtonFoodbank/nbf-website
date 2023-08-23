import { fetchParcels } from "@/common/fetch";
import supabase from "@/supabaseClient";

export interface ParcelInfo {
    voucherNumber: string;
    packingDate: string;
    collectionDate: string;
    collectionSite: string;
}

interface ParcelInfoAndClientID {
    parcelInfo: ParcelInfo;
    clientID: string;
}

const formatDate = (dateString: string | null): string => {
    if (!dateString) {
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

export const prepareParcelInfo = async (parcelID: string): Promise<ParcelInfoAndClientID> => {
    const fetchedData = await fetchParcels(parcelID, supabase);
    const parcelInfo: ParcelInfo = {
        voucherNumber: fetchedData.voucher_number ?? "",
        packingDate: formatDate(fetchedData.packing_datetime),
        collectionDate: formatDate(fetchedData.collection_datetime),
        collectionSite: fetchedData.collection_centre ?? "",
    };

    if (parcelInfo.collectionSite === "Delivery") {
        parcelInfo.collectionSite = "N/A - Delivery";
    }

    return { parcelInfo: parcelInfo, clientID: fetchedData.client_id };
};
