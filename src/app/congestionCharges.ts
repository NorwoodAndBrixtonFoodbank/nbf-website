import { ParcelsPlusRow } from "@/databaseUtils";
import { logErrorReturnLogId } from "@/logger/logger";
import supabase from "@/supabaseClient";
import { EdgeFunctionError } from "./errorClasses";
import { ParcelForDayOverview } from "@/pdf/DayOverview/DayOverviewPdfButton";

export type CongestionChargeDetails = {
    postcode: string;
    congestionCharge: boolean;
};

export const getCongestionChargeDetailsForParcelsTable = async (
    processingData: ParcelsPlusRow[],
): Promise<CongestionChargeDetails[]> => {
    const postcodes = [];
    for (const parcel of processingData) {
        postcodes.push(parcel.client_address_postcode);
    }

    const postcodesWithCongestionChargeDetails = await checkForCongestionCharge(postcodes);

    return postcodesWithCongestionChargeDetails;
};

export const addCongestionChargeDetailsForDayOverview = async (parcels: ParcelForDayOverview[]) => {
    const postcodes: (string | null)[] = [];

    for (const parcel of parcels) {
        if (parcel.client?.address_postcode) {
            postcodes.push(parcel.client?.address_postcode);
        }
    }

    const postcodesWithCongestionChargeDetails = await checkForCongestionCharge(postcodes);

    for (let i = 0; i < parcels.length ; i++) {
        parcels[i].congestionChargeApplies = postcodesWithCongestionChargeDetails[i].congestionCharge;
    }

    return parcels;
}

const checkForCongestionCharge = async (postcodes: (string | null)[]) => {

    const response = await supabase.functions.invoke("check-congestion-charge", {
        body: { postcodes: postcodes },
    });

    if (response.error) {
        const logId = await logErrorReturnLogId(
            "Error with congestion charge check",
            response.error
        );
        throw new EdgeFunctionError("congestion charge check", logId);
    }
    return response.data;

}
