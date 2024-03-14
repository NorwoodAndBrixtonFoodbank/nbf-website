import { Supabase } from "@/supabaseUtils";
import { DatabaseError, EdgeFunctionError } from "../errorClasses";
import { ParcelsTableRow, processingDataToParcelsTableData } from "./getParcelsTableData";
import { Filter, FilterMethodType } from "@/components/Tables/Filters";
import Table, { SortState } from "@/components/Tables/Table";
import { PostgrestQueryBuilder, PostgrestFilterBuilder } from "@supabase/postgrest-js";
import { Database, Tables } from "@/databaseTypesFile";
import { TableNames } from "@/databaseUtils";

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
        throw new EdgeFunctionError("congestion charge check");
    }

    return response.data;
};

export type ParcelProcessingData = Awaited<ReturnType<typeof getParcelProcessingData>>;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const getParcelProcessingData = async (
    supabase: Supabase,
    filters: Filter<ParcelsTableRow, any>[],
    sortState: SortState<ParcelsTableRow>,
    start?: number,
    end?: number,
    parcelIds?: string[]
) => {
    let query = supabase.from("parcels").select(
        `
        parcel_id:primary_key,
        
        collection_centre:collection_centres!inner ( 
            name, 
            acronym
         ),
         
        collection_datetime,
        packing_datetime,
        voucher_number,
        
        client:clients!inner (
            primary_key,
            full_name,
            address_postcode,
            flagged_for_attention,
            signposting_call_required,
            phone_number,
            
            family_count:family_count8!inner(
                family_count
            )
        )
    `    
    //    last_status:last_status_z2!inner(parcel_id, event_name, timestamp, event_data, workflow_order)
    //`
    );
    //query.limit(1, {foreignTable: "family_count"});
   // query.limit(1, {foreignTable: "last_status"})
    if (sortState.sort && sortState.column.sortMethod) {
        query = sortState.column.sortMethod(query, sortState.sortDirection);
    } else {
        query = query.order("packing_datetime", { ascending: false });
    }

    filters.forEach((filter) => {
        if (filter.methodConfig.methodType === FilterMethodType.Server) {
            query = filter.methodConfig.method(query, filter.state);
        }
    });

    if (typeof start === "number" && typeof end === "number") {
        query = query.range(start, end);
    }

    if (parcelIds) {
        query = query.in("primary_key", parcelIds);
    }

    const { data, error } = await query;

    if (error) {
        console.error(error);
        throw new DatabaseError("fetch", "parcel table data");
    }
    return data ?? [];
};

export const getParcelsData = async (
    supabase: Supabase,
    filters: Filter<ParcelsTableRow, any[]>[],
    sortState: SortState<ParcelsTableRow>,
    start?: number,
    end?: number,
    parcelIds?: string[]
): Promise<ParcelsTableRow[]> => {
    const processingData = await getParcelProcessingData(
        supabase,
        filters,
        sortState,
        start,
        end,
        parcelIds
    );
    const congestionCharge = await getCongestionChargeDetailsForParcels(processingData, supabase);
    const formattedData = processingDataToParcelsTableData(processingData, congestionCharge);

    return formattedData;
};

export const getParcelsCount = async (
    supabase: Supabase,
    filters: Filter<ParcelsTableRow, any>[]
): Promise<number> => {
    let query = supabase.from("parcels").select(
        `
        parcel_id:primary_key,
        
        collection_centre:collection_centres!inner ( 
            name, 
            acronym
         ),
         
        collection_datetime,
        packing_datetime,
        voucher_number,
        
        client:clients!inner (
            primary_key,
            full_name,
            address_postcode,
            flagged_for_attention,
            signposting_call_required,
            phone_number,
            
            family_count:family_count8!inner(
                family_count
            )
        )
    `    
    //    last_status:last_status_z2!inner(parcel_id, event_name, timestamp, event_data, workflow_order)
    //`,
    ,    { count: "exact", head: true }
    );
    //query.limit(1, {foreignTable: "family_count"});
    //query.limit(1, {foreignTable: "last_status"})

    filters.forEach((filter) => {
        if (filter.methodConfig.methodType === FilterMethodType.Server) {
            query = filter.methodConfig.method(query, filter.state);
        }
    });

    query = query
        .order("packing_datetime", { ascending: false })

    const { count, error } = await query;
    if (error || count === null) {
        console.error(error);
        throw new DatabaseError("fetch", "parcels");
    }
    return count;
};

export const getParcelIds = async (
    supabase: Supabase,
    filters: Filter<ParcelsTableRow, any>[],
    sortState: SortState<ParcelsTableRow>
): Promise<string[]> => {
    let query = supabase.from("parcels").select(
        `
      parcel_id:primary_key,
      
      collection_centre:collection_centres!inner ( 
          name, 
          acronym
       ),
       
      collection_datetime,
      packing_datetime,
      voucher_number,
      
      client:clients!inner (
        primary_key,
        full_name,
        address_postcode,
        flagged_for_attention,
        signposting_call_required,
        phone_number,
        
        family_count:family_count8(
            family_count
        )
    )
    `
    //last_status:last_status_z2!inner(parcel_id, event_name, timestamp, event_data, workflow_order)
    //`
    );
    //query.limit(1, {foreignTable: "family_count"});
    //query.limit(1, {foreignTable: "last_status"});

    filters.forEach((filter) => {
        if (filter.methodConfig.methodType === FilterMethodType.Server) {
            query = filter.methodConfig.method(query, filter.state);
        }
    });
    if (sortState.sort && sortState.column.sortMethod) {
        query = sortState.column.sortMethod(query, sortState.sortDirection);
    } else {
        query = query.order("packing_datetime", { ascending: false });
    }

    const { data, error } = await query;
    if (error) {
        throw new DatabaseError("fetch", "parcels");
    }
    return data.map((parcel) => parcel.parcel_id) ?? [];
};

export const getAllValuesForKeys = async <Return>(
    supabase: Supabase,
    table: TableNames,
    selectMethod: (
        query: PostgrestQueryBuilder<Database["public"], any, any>
    ) => PostgrestFilterBuilder<Database["public"], any, any>
): Promise<Return> => {
    const query = selectMethod(supabase.from(table));
    const { data, error } = await query;
    if (error) {
        throw new DatabaseError("fetch", table);
    }
    return data ?? [];
};

export interface CollectionCentresOptions {
    name: string;
    acronym: string;
}

export interface LastStatusOptionsResponse {
    parcel_id: string;
    packing_datetime: Date;
    last_status: { event_name: string }[];
}

export interface StatusResponseRow {
    event_name: string
}