import { Supabase } from "@/supabaseUtils";
import { DatabaseError, EdgeFunctionError } from "../errorClasses";
import { DateRangeState } from "@/components/DateRangeInputs/DateRangeInputs";
import { logErrorReturnLogId } from "@/logger/logger";

export type CongestionChargeDetails = {
    postcode: string;
    congestionCharge: boolean;
};

export const getCongestionChargeDetailsForParcels = async (
    processingData: ParcelProcessingData,
    supabase: Supabase
): Promise<CongestionChargeDetails[]> => {
    const postcodes = [];
    for (const parcel of processingData) {
        postcodes.push(parcel.client!.address_postcode);
    }

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

export type ParcelProcessingData = Awaited<ReturnType<typeof getParcelProcessingData>>;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const getParcelProcessingData = async (supabase: Supabase, dateRange: DateRangeState) => {
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
        voucher_number,
        
        client:clients (
            primary_key,
            full_name,
            address_postcode,
            flagged_for_attention,
            signposting_call_required,
            phone_number,
            
            family:families (
                age,
                gender
            )
        ),
        
        events (
            event_name,
            event_data,
            timestamp
        )
    `
        )
        .gte("packing_datetime", dateRange.from)
        .lte("packing_datetime", dateRange.to)
        .order("packing_datetime", { ascending: false })
        .order("timestamp", { ascending: false, foreignTable: "events" })
        .limit(1, { foreignTable: "events" });

    if (error) {
        const logId = await logErrorReturnLogId("Error with fetch: parcel table", error);
        throw new DatabaseError("fetch", "parcel table", logId);
    }

    return data;
};
