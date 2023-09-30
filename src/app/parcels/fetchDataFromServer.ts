import supabase from "@/supabaseServer";

export type CongestionChargeDetails = {
    postcode: string;
    congestionCharge: boolean;
};

export const getCongestionChargeDetails = async (
    processingData: ParcelProcessingData
): Promise<CongestionChargeDetails[]> => {
    const postcodes = [];
    for (const parcel of processingData) {
        postcodes.push(parcel.client!.address_postcode);
    }

    const response = await supabase.functions.invoke("check-congestion-charge", {
        body: { postcodes: postcodes },
    });

    return JSON.parse(response.data);
};

export type ParcelProcessingData = Awaited<ReturnType<typeof getProcessingData>>;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const getProcessingData = async () => {
    const response = await supabase
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
        .order("packing_datetime", { ascending: false })
        .order("timestamp", { ascending: false, foreignTable: "events" })
        .limit(1, { foreignTable: "events" });

    return response.data ?? [];
};
