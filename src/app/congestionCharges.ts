import { logErrorReturnLogId } from "@/logger/logger";
import supabase from "@/supabaseClient";
import { EdgeFunctionError } from "./errorClasses";

export type CongestionChargeDetails = {
    postcode: string;
    congestionCharge: boolean;
};

export const checkForCongestionCharge = async (
    postcodes: (string | null)[]
): Promise<CongestionChargeDetails[]> => {
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
};
