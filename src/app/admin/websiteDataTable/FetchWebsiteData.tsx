import supabase from "@/supabaseClient";
import { DatabaseError } from "@/app/errorClasses";
import { WebsiteDataRow } from "./WebsiteDataTable";
import { Tables } from "@/databaseTypesFile";

type DbWebsiteData = Tables<"website_data">;

export const fetchWebsiteData = async (): Promise<WebsiteDataRow[]> => {
    const { data, error } = await supabase.from("website_data").select().order("name");
    if (error) {
        throw new DatabaseError("fetch", "website data");
    }

    return data.map(
        (row): WebsiteDataRow => ({
            name: row.name,
            value: row.value,
            id: row.name,
        })
    );
};

export const updateDbWebsiteData = async (row: WebsiteDataRow): Promise<void> => {
    const processedData: DbWebsiteData = { name: row.name, value: row.value };
    const { error } = await supabase
        .from("website_data")
        .update(processedData)
        .eq("name", processedData.name);

    if (error) {
        throw new DatabaseError("update", "website data");
    }
};
