import { Schema } from "@/databaseUtils";
import supabase from "@/supabaseClient";
import { PostgrestError } from "@supabase/supabase-js";

export const getClientFromClients = async (
    clientId: string
): Promise<{ data: Schema["clients"] | null; error: PostgrestError | null }> => {
    const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("primary_key", clientId)
        .single();
    return { data, error };
};

export const getAllPeopleFromFamily = async (
    familyId: string
): Promise<{ data: Schema["families"][] | null; error: PostgrestError | null }> => {
    const { data, error } = await supabase
        .from("family_members")
        .select("*")
        .eq("family_id", familyId);
    return { data, error };
};
