import supabase from "@/supabaseClient";
import { Tables } from "@/databaseTypesFile";
import { logErrorReturnLogId } from "@/logger/logger";
import { PostgrestError } from "@supabase/supabase-js";
import { CollectionCentresTableRow } from "@/app/admin/collectionCentresTable/CollectionCentresTable";
import { Schema } from "@/databaseUtils";

type DbCollectionCentre = Tables<"collection_centres">;
type NewDbCollectionCentre = Omit<DbCollectionCentre, "primary_key">;

type FetchCollectionCentresResult =
    | {
          data: CollectionCentresTableRow[];
          error: null;
      }
    | {
          data: null;
          error: { type: "failedToFetchCollectionCentres"; logId: string };
      };

export const defaultCollectionTimeSlots: Schema["collection_centres"]["active_time_slots"] = [
    "10:00:00",
    "10:15:00",
    "10:30:00",
    "10:45:00",
    "11:00:00",
    "11:15:00",
    "11:30:00",
    "11:45:00",
    "12:00:00",
    "12:15:00",
    "12:30:00",
    "12:45:00",
    "13:00:00",
    "13:15:00",
    "13:30:00",
    "13:45:00",
    "14:00:00",
];

export const fetchCollectionCentresForTable = async (): Promise<FetchCollectionCentresResult> => {
    const { data, error } = await supabase.from("collection_centres").select().order("name");
    if (error) {
        const logId = await logErrorReturnLogId("Failed to fetch collection centres", { error });
        return { data: null, error: { type: "failedToFetchCollectionCentres", logId } };
    }

    const formattedData = data.map(
        (row): CollectionCentresTableRow => ({
            name: row.name,
            acronym: row.acronym,
            id: row.primary_key,
            isShown: row.is_shown,
            isDelivery: row.is_delivery,
            activeTimeSlots: row.active_time_slots,
            isNew: false,
        })
    );

    return { data: formattedData, error: null };
};

const formatExistingRowToDBCollectionCentre = (
    row: CollectionCentresTableRow
): DbCollectionCentre => {
    return {
        primary_key: row.id,
        name: row.name,
        acronym: row.acronym,
        is_shown: row.isShown,
        is_delivery: row.isDelivery,
        active_time_slots: row.activeTimeSlots,
    };
};

const formatNewRowToDBCollectionCentre = (
    newRow: CollectionCentresTableRow
): NewDbCollectionCentre => {
    return {
        name: newRow.name,
        acronym: newRow.acronym,
        is_shown: newRow.isShown,
        is_delivery: newRow.isDelivery,
        active_time_slots: newRow.activeTimeSlots,
    };
};

export type InsertCollectionCentreResult =
    | {
          data: { collectionCentreId: string };
          error: null;
      }
    | {
          data: null;
          error: {
              dbError: PostgrestError;
              logId: string;
          };
      };

export const insertNewCollectionCentre = async (
    newRow: CollectionCentresTableRow
): Promise<InsertCollectionCentreResult> => {
    const data = formatNewRowToDBCollectionCentre(newRow);
    const { data: collectionCentre, error } = await supabase
        .from("collection_centres")
        .insert(data)
        .select()
        .single();

    if (error) {
        const logId = await logErrorReturnLogId("Failed to add a collection centre", {
            error,
            newCollectionCentre: data,
        });
        return { data: null, error: { dbError: error, logId } };
    }

    return { data: { collectionCentreId: collectionCentre.primary_key }, error: null };
};

export type UpdateCollectionCentreResult = {
    error: {
        dbError: PostgrestError;
        logId: string;
    } | null;
};

export const updateDbCollectionCentre = async (
    row: CollectionCentresTableRow
): Promise<UpdateCollectionCentreResult> => {
    const processedData = formatExistingRowToDBCollectionCentre(row);
    const { error } = await supabase
        .from("collection_centres")
        .update(processedData)
        .eq("primary_key", processedData.primary_key);

    if (error) {
        const logId = await logErrorReturnLogId("Failed to update collection centre", {
            error,
            newCollectionCentreData: processedData,
        });

        return { error: { dbError: error, logId } };
    }

    return { error: null };
};
