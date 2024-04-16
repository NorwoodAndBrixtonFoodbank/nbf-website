import { Schema } from "@/databaseUtils";
import { Supabase } from "@/supabaseUtils";
import { logErrorReturnLogId, logWarningReturnLogId } from "@/logger/logger";

type CollectionCentre = {
    name: Schema["collection_centres"]["name"];
    acronym: Schema["collection_centres"]["acronym"];
    primary_key: Schema["collection_centres"]["primary_key"];
};

type PackingSlot = {
    name: Schema["packing_slots"]["name"];
    primary_key: Schema["packing_slots"]["primary_key"];
    is_shown: Schema["packing_slots"]["is_shown"];
};

export interface ParcelWithCollectionCentreAndPackingSlot {
    client_id: string;
    collection_centre: CollectionCentre | null;
    collection_datetime: string | null;
    packing_date: string | null;
    packing_slot: PackingSlot | null;
    primary_key: string;
    voucher_number: string | null;
}

export type FetchParcelResponse =
    | { data: ParcelWithCollectionCentreAndPackingSlot; error: null }
    | { data: null; error: FetchParcelError };

export type FetchParcelErrorType = "failedToFetchParcel" | "noMatchingParcels";
export interface FetchParcelError {
    type: FetchParcelErrorType;
    logId: string;
}

export const fetchParcel = async (
    parcelID: string,
    supabase: Supabase
): Promise<FetchParcelResponse> => {
    const { data, error } = await supabase
        .from("parcels")
        .select(
            `*, 
            collection_centre:collection_centres ( 
                name,
                acronym,
                primary_key
            ),
            packing_slot: packing_slots (
                name,
                primary_key,
                is_shown
            )`
        )
        .eq("primary_key", parcelID);
    if (error) {
        const logId = await logErrorReturnLogId("Error with fetch: Parcel", error);
        return { data: null, error: { type: "failedToFetchParcel", logId: logId } };
    }
    if (data.length !== 1) {
        const errorMessage = `${
            data.length === 0 ? "No" : "Multiple"
        } records match this parcel ID.`;
        const logId = await logWarningReturnLogId(`${errorMessage} ${parcelID}`);
        return { data: null, error: { type: "noMatchingParcels", logId: logId } };
    }
    return { data: data[0], error: null };
};

export type CollectionCentresLabelsAndValues = [
    string,
    Schema["collection_centres"]["primary_key"],
][];

interface CollectionCentresInfo {
    deliveryPrimaryKey: Schema["collection_centres"]["primary_key"];
    collectionCentresLabelsAndValues: CollectionCentresLabelsAndValues;
}

type FetchCollectionCentresResponse =
    | {
          data: CollectionCentresInfo;
          error: null;
      }
    | {
          data: null;
          error: FetchCollectionCentresError;
      };

type FetchCollectionCentresErrorType = "collectionCentresFetchFailed";
export type FetchCollectionCentresError = { type: FetchCollectionCentresErrorType; logId: string };

export const getCollectionCentresInfo = async (
    supabase: Supabase
): Promise<FetchCollectionCentresResponse> => {
    const { data, error } = await supabase.from("collection_centres").select("primary_key, name");

    if (error) {
        const logId = await logErrorReturnLogId("Error with fetch: Collection centres data", error);
        return { data: null, error: { type: "collectionCentresFetchFailed", logId: logId } };
    }

    const collectionCentresLabelsAndValues: CollectionCentresLabelsAndValues = data!
        .filter((collectionCentre) => collectionCentre.name !== "Delivery")
        .map((collectionCentre) => [collectionCentre.name, collectionCentre.primary_key]);

    const deliveryPrimaryKey = data!.filter(
        (collectionCentre) => collectionCentre.name === "Delivery"
    )[0].primary_key;

    return {
        data: {
            deliveryPrimaryKey: deliveryPrimaryKey,
            collectionCentresLabelsAndValues: collectionCentresLabelsAndValues,
        },
        error: null,
    };
};

type FetchClientResponse =
    | {
          data: Schema["clients"];
          error: null;
      }
    | {
          data: null;
          error: { type: FetchClientErrorType; logId: string };
      };

export type FetchClientErrorType = "clientFetchFailed" | "noMatchingClients";

export const fetchClient = async (
    primaryKey: string,
    supabase: Supabase
): Promise<FetchClientResponse> => {
    const { data, error } = await supabase.from("clients").select().eq("primary_key", primaryKey);
    if (error) {
        const logId = await logErrorReturnLogId("Error with fetch: Client data", error);
        return { data: null, error: { type: "clientFetchFailed", logId: logId } };
    }
    if (data.length !== 1) {
        const errorMessage = `${
            data.length === 0 ? "No" : "Multiple"
        } records match this client ID.`;

        const logId = await logErrorReturnLogId(
            "Error with client ID" + `${errorMessage} ${primaryKey}`
        );
        return { data: null, error: { type: "noMatchingClients", logId: logId } };
    }
    return { data: data[0], error: null };
};

type FetchFamilyResponse =
    | {
          data: Schema["families"][];
          error: null;
      }
    | {
          data: null;
          error: { type: FetchFamilyErrorType; logId: string };
      };

export type FetchFamilyErrorType = "familyFetchFailed";

export const fetchFamily = async (
    familyID: string,
    supabase: Supabase
): Promise<FetchFamilyResponse> => {
    const { data, error } = await supabase.from("families").select().eq("family_id", familyID);
    if (error) {
        const logId = await logErrorReturnLogId("Error with fetch: Family data", error);
        return { data: null, error: { type: "familyFetchFailed", logId: logId } };
    }
    return { data: data, error: null };
};

type FetchListsReponse =
    | {
          data: Schema["lists"][];
          error: null;
      }
    | {
          data: null;
          error: FetchListsError;
      };

export type FetchListsErrorType = "listsFetchFailed";

export interface FetchListsError {
    type: FetchListsErrorType;
    logId: string;
}

export const fetchLists = async (supabase: Supabase): Promise<FetchListsReponse> => {
    const { data, error } = await supabase.from("lists").select().order("row_order");
    if (error) {
        const logId = await logErrorReturnLogId("Error with fetch: Lists data", error);
        return { data: null, error: { type: "listsFetchFailed", logId: logId } };
    }
    return { data: data, error: null };
};

type FetchListsCommentResponse =
    | {
          data: string;
          error: null;
      }
    | {
          data: null;
          error: FetchListsCommentError;
      };

export type FetchListsCommentErrorType = "listsCommentFetchFailed";

export interface FetchListsCommentError {
    type: FetchListsCommentErrorType;
    logId: string;
}

export const fetchComment = async (supabase: Supabase): Promise<FetchListsCommentResponse> => {
    const { data, error } = await supabase
        .from("website_data")
        .select()
        .eq("name", "lists_text")
        .limit(1)
        .single();

    if (error) {
        const logId = await logErrorReturnLogId("Error with fetch: Lists comment", error);
        return { data: null, error: { type: "listsCommentFetchFailed", logId: logId } };
    }

    return { data: data.value, error: null };
};

export type PackingSlotsLabelsAndValues = [string, Schema["packing_slots"]["primary_key"]][];
type PackingSlotsResponse =
    | {
          data: PackingSlotsLabelsAndValues;
          error: null;
      }
    | {
          data: null;
          error: PackingSlotsError;
      };
type PackingSlotsErrorType = "packingSlotsFetchFailed";
export interface PackingSlotsError {
    type: PackingSlotsErrorType;
    logId: string;
}

export const fetchPackingSlotsInfo = async (supabase: Supabase): Promise<PackingSlotsResponse> => {
    const { data, error } = await supabase
        .from("packing_slots")
        .select("primary_key, name")
        .order("order")
        .eq("is_shown", true);

    if (error) {
        const logId = await logErrorReturnLogId("Error with fetch: Packing slots data", error);
        return { data: null, error: { type: "packingSlotsFetchFailed", logId: logId } };
    }

    const packingSlotsLabelsAndValues: PackingSlotsLabelsAndValues = data.map((packingSlot) => [
        packingSlot.name,
        packingSlot.primary_key,
    ]);

    return { data: packingSlotsLabelsAndValues, error: null };
};
