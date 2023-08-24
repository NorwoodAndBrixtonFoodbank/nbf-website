import { FetchError } from "@/app/errorClasses";
import { Schema } from "@/database_utils";
import supabase from "@/supabaseClient";

export const fetchParcels = async (parcelID: string): Promise<Schema["parcels"]> => {
    const { data, error } = await supabase.from("parcels").select().eq("primary_key", parcelID);
    if (error) {
        throw new FetchError("the parcel data");
    }
    if (data.length !== 1) {
        const errorMessage = `${
            data.length === 0 ? "No" : "Multiple"
        } records match this parcel ID.`;
        throw new Error(errorMessage);
    }
    return data[0];
};

export const fetchClients = async (primaryKey: string): Promise<Schema["clients"]> => {
    const { data, error } = await supabase.from("clients").select().eq("primary_key", primaryKey);
    if (error) {
        throw new FetchError("the client data");
    }
    if (data.length !== 1) {
        const errorMessage = `${
            data.length === 0 ? "No" : "Multiple"
        } records match this client ID.`;
        throw new Error(errorMessage);
    }
    return data[0];
};

export const fetchFamilies = async (familyID: string): Promise<Schema["families"][]> => {
    const { data, error } = await supabase.from("families").select().eq("family_id", familyID);
    if (error) {
        throw new FetchError("the family data");
    }
    return data;
};

export const fetchLists = async (): Promise<Schema["lists"][]> => {
    const { data, error } = await supabase.from("lists").select();
    if (error) {
        throw new FetchError("the lists data");
    }
    return data;
};

export const fetchComment = async (): Promise<string> => {
    const { data, error } = await supabase.from("website_data").select().eq("name", "lists_text");
    if (error) {
        throw new FetchError("the lists comment");
    }
    return data?.[0]?.value ?? "";
};
