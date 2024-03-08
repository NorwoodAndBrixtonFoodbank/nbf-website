import { Supabase } from "@/supabaseUtils";
import { DatabaseError, EdgeFunctionError } from "../errorClasses";
import { DateRangeState } from "@/components/DateRangeInputs/DateRangeInputs";
import { ParcelsTableRow, processingDataToParcelsTableData } from "./getParcelsTableData";
import { Filter } from "@/components/Tables/Filters";
import { CustomColumn, SortState } from "@/components/Tables/Table";

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
export const getParcelProcessingData = async (supabase: Supabase, start: number, end: number, filters: Filter<ParcelsTableRow, any>[], columns: CustomColumn<ParcelsTableRow>[], sortState?: SortState<ParcelsTableRow>) => {
    
    let query = supabase
        .from("parcels")
        .select(
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
            
            family:families (
                age,
                gender
            )
        ),
        
        events!inner (
            event_name,
            event_data,
            timestamp
        )
    `,{ count: 'exact', head: true }
        )
        const columnToSortBy = columns?.find((column)=>column.sortField===sortState?.key);
        if (columnToSortBy?.sortMethod && sortState) {
            query = columnToSortBy.sortMethod(query, sortState?.sortDirection);
        }
        query = query.order("timestamp", { ascending: false, foreignTable: "events" })
        .limit(1, { foreignTable: "events" });

        filters.forEach((filter) => {
            query = filter.filterMethod(query, filter.state);
        })    
    
        query = query.range(start, end);
    
        const { data, error} = await query

    if (error) {
        console.log(error);
        throw new DatabaseError("fetch", "parcel table data");
        
    }

    return data ?? [];
};

export const getParcelsData = async (supabase: Supabase, start: number, end: number, filters: Filter<ParcelsTableRow, any[]>[], columns: CustomColumn<ParcelsTableRow>[], sortState?: SortState<ParcelsTableRow>): Promise<ParcelsTableRow[]> => {
    const processingData = await getParcelProcessingData(supabase, start, end, filters, columns, sortState);
    const congestionCharge = await getCongestionChargeDetailsForParcels(processingData, supabase);
    const formattedData = processingDataToParcelsTableData(processingData, congestionCharge);

    return formattedData;
}

export const getParcelsCount = async (supabase: Supabase, filters: Filter<ParcelsTableRow, any>[]): Promise<number> => {
    
    let query = supabase
  .from('parcels')
  .select( `
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
      
      family:families (
          age,
          gender
      )
  ),
  
  events!inner (
      event_name,
      event_data,
      timestamp
  )
`, { count: 'exact', head: true });

  filters.forEach((filter) => {
    query = filter.filterMethod(query, filter.state);
})

query = query.order("packing_datetime", { ascending: false })
.order("timestamp", { ascending: false, foreignTable: "events" })
.limit(1, { foreignTable: "events" });

const { count, error } = await query
  
  if (error || count === null) {
    throw new DatabaseError("fetch", "parcels");

  }
  return count;
}
