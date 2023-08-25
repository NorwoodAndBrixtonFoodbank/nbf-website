import { DatabaseError } from "@/app/errorClasses";
import { Schema } from "@/database_utils";
import supabaseClient from "@/supabaseClient";
import supabaseServer from "@/supabaseServer";

export type Supabase = typeof supabaseClient | typeof supabaseServer;

export const fetchParcels = async (
    parcelID: string,
    supabase: Supabase
): Promise<Schema["parcels"]> => {
    const { data, error } = await supabase.from("parcels").select().eq("primary_key", parcelID);
    if (error) {
        throw new DatabaseError("fetch", "parcel data");
    }
    if (data.length !== 1) {
        const errorMessage = `${
            data.length === 0 ? "No" : "Multiple"
        } records match this parcel ID.`;
        throw new Error(errorMessage);
    }
    return data[0];
};

export const fetchClients = async (
    primaryKey: string,
    supabase: Supabase
): Promise<Schema["clients"]> => {
    const { data, error } = await supabase.from("clients").select().eq("primary_key", primaryKey);
    if (error) {
        throw new DatabaseError("fetch", "client data");
    }
    if (data.length !== 1) {
        const errorMessage = `${
            data.length === 0 ? "No" : "Multiple"
        } records match this client ID.`;
        throw new Error(errorMessage);
    }
    return data[0];
};

export const fetchFamilies = async (
    familyID: string,
    supabase: Supabase
): Promise<Schema["families"][]> => {
    const { data, error } = await supabase.from("families").select().eq("family_id", familyID);
    if (error) {
        throw new DatabaseError("fetch", "family data");
    }
    return data;
};

export const fetchLists = async (supabase: Supabase): Promise<Schema["lists"][]> => {
    const { data, error } = await supabase.from("lists").select();
    if (error) {
        throw new DatabaseError("fetch", "lists data");
    }
    return data;
};

export const fetchComment = async (supabase: Supabase): Promise<string> => {
    const { data, error } = await supabase.from("website_data").select().eq("name", "lists_text");
    if (error) {
        throw new DatabaseError("fetch", "lists comment");
    }
    return data[0].value ?? "";
};
