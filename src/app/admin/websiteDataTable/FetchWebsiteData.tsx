import supabase from "@/supabaseClient";
import { DatabaseError } from "@/app/errorClasses";
import { WebsiteDataRow } from "./WebsiteDataTable";
import { Tables } from "@/databaseTypesFile";

type DbWebsiteData = Tables<"website_data">;

const getReadableName = (name: string): string =>
    name
        .split("_")
        .map((word) => `${word[0].toUpperCase()}${word.slice(1)}`)
        .join(" ");

const getUnreadableName = (name: string): string =>
    name
        .split(" ")
        .map((word) => word.toLowerCase())
        .join("_");

export const fetchWebsiteData = async (): Promise<WebsiteDataRow[]> => {
    const { data, error } = await supabase.from("website_data").select().order("name");
    if (error) {
        throw new DatabaseError("fetch", "website data");
    }

    return data.map(
        (row): WebsiteDataRow => ({
            readableName: getReadableName(row.name),
            value: row.value,
            id: row.name,
        })
    );
};

export const updateDbWebsiteData = async (row: WebsiteDataRow): Promise<void> => {
    const processedData: DbWebsiteData = {
        name: getUnreadableName(row.readableName),
        value: row.value,
    };
    const { error } = await supabase
        .from("website_data")
        .update(processedData)
        .eq("name", processedData.name);

    if (error) {
        throw new DatabaseError("update", "website data");
    }
};
