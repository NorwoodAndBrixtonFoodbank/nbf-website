import { logErrorReturnLogId } from "@/logger/logger";
import supabase from "@/supabaseClient";

export type CongestionChargeDetails = {
    postcode: string;
    congestionCharge: boolean;
};

export type CongestionChargeError = "failedToRetrieveCongestionChargeDetails";

export type CongestionChargeReturnType =
    | {
          data: CongestionChargeDetails[];
          error: null;
      }
    | {
          data: null;
          error: { type: CongestionChargeError; logId: string };
      };

export const checkForCongestionCharge = async (
    postcodes: (string | null)[]
): Promise<CongestionChargeReturnType> => {
    const response = await supabase.functions.invoke("check-congestion-charge", {
        body: { postcodes: postcodes },
    });

    if (response.error) {
        const logId = await logErrorReturnLogId(
            "Error with congestion charge check",
            {error: response.error}
        );
        return { data: null, error: { type: "failedToRetrieveCongestionChargeDetails", logId } };
    }

    return { data: response.data, error: null };
};
