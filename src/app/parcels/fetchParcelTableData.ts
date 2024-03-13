import { Supabase } from "@/supabaseUtils";
import { DatabaseError, EdgeFunctionError } from "../errorClasses";
import { DateRangeState } from "@/components/DateRangeInputs/DateRangeInputs";
import { v4 as uuidv4 } from "uuid";
import { logError } from "@/logger/logger";

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
        const id = uuidv4();
        const meta = {
            error: response.error,
            id: id,
            location: "app/clients/fetchParcelTableData.ts",
        };
        void logError("Error with congestion charge check", meta);
        throw new EdgeFunctionError("congestion charge check");
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
        const id = uuidv4();
        const meta = {
            error: error,
            id: id,
            location: "app/clients/fetchParcelTableData.ts",
        };
        void logError("Error fetching clients", meta);
        throw new DatabaseError("fetch", "parcel table data");
    }

    return data ?? [];
};
