import supabase from "@/supabaseServer";

export type CongestionChargeDetails = {
    postcode: string;
    congestionCharge: boolean;
};

export const getCongestionChargeDetails = async (
    processingData: ProcessingData
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

export type RawClientDetails = Awaited<ReturnType<typeof getRawClientDetails>>;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const getRawClientDetails = async (parcelId: string) => {
    const response = await supabase
        .from("parcels")
        .select(
            `
        voucher_number,
        packing_datetime,

        client:clients(
            primary_key,
            full_name,
            phone_number,
            delivery_instructions,
            address_1,
            address_2,
            address_town,
            address_county,
            address_postcode,

            family:families(
                age,
                gender
            ),

            dietary_requirements,
            feminine_products,
            baby_food,
            pet_food,
            other_items,
            extra_information
        )

    `
        )
        .eq("primary_key", parcelId)
        .single();

    return response.data;
};

export type ProcessingData = Awaited<ReturnType<typeof getProcessingData>>;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const getProcessingData = async () => {
    const response = await supabase
        .from("parcels")
        .select(
            `
        parcel_id:primary_key,
        collection_centre,
        collection_datetime,
        packing_datetime,
        
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
            timestamp
        )
    `
        )
        .order("packing_datetime", { ascending: false })
        .order("timestamp", { ascending: false, foreignTable: "events" })
        .limit(1, { foreignTable: "events" });

    return response.data ?? [];
};
