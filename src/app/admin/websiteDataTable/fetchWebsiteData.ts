import supabase from "@/supabaseClient";
import { DatabaseError } from "@/app/errorClasses";
import { WebsiteDataRow } from "./WebsiteDataTable";
import { Tables } from "@/databaseTypesFile";
import { logErrorReturnLogId } from "@/logger/logger";

type DbWebsiteData = Tables<"website_data">;

const getReadableName = (name: string): string =>
    name
        .split("_")
        .map((word) => `${word[0].toUpperCase()}${word.slice(1)}`)
        .join(" ");

export const fetchWebsiteData = async (): Promise<WebsiteDataRow[]> => {
    const { data, error } = await supabase.from("website_data").select().order("name");
    if (error) {
        const logId = await logErrorReturnLogId("Error with fetch: website data", error);
        throw new DatabaseError("fetch", "website data table", logId);
    }

    return data.map(
        (row): WebsiteDataRow => ({
            dbName: row.name,
            readableName: getReadableName(row.name),
            value: row.value,
            id: row.name,
        })
    );
};

export const updateDbWebsiteData = async (row: WebsiteDataRow): Promise<void> => {
    const processedData: DbWebsiteData = {
        name: row.dbName,
        value: row.value,
    };
    const { error } = await supabase
        .from("website_data")
        .update(processedData)
        .eq("name", processedData.name);

    if (error) {
        const logId = await logErrorReturnLogId("Error with update: website data", error);
        throw new DatabaseError("update", "website data table", logId);
    }
};
