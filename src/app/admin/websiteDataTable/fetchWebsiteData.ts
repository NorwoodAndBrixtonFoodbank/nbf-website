import supabase from "@/supabaseClient";
import { WebsiteDataRow } from "./WebsiteDataTable";
import { Tables } from "@/databaseTypesFile";
import { logErrorReturnLogId } from "@/logger/logger";
import { AuditLog, sendAuditLog } from "@/server/auditLog";

type DbWebsiteData = Tables<"website_data">;
type FetchWebsiteDataErrors = "Failed to fetch website data";
type FetchWebsiteDataErrorReturn =
    | {
          data: null;
          error: { type: FetchWebsiteDataErrors; logId: string };
      }
    | {
          data: WebsiteDataRow[];
          error: null;
      };
type UpdateWebsiteDataErrors = "Failed to update website data";
type UpdateWebsiteDataErrorReturn =
    | {
          error: { type: UpdateWebsiteDataErrors; logId: string };
      }
    | { error: null };

const getReadableName = (name: string): string =>
    name
        .split("_")
        .map((word) => `${word[0].toUpperCase()}${word.slice(1)}`)
        .join(" ");

export const fetchWebsiteData = async (): Promise<FetchWebsiteDataErrorReturn> => {
    const { data, error } = await supabase.from("website_data").select().order("name");

    if (error) {
        const logId = await logErrorReturnLogId("Error with fetch: website data", error);
        return { error: { type: "Failed to fetch website data", logId }, data: null };
    }

    const websiteData = data.map(
        (row): WebsiteDataRow => ({
            dbName: row.name,
            readableName: getReadableName(row.name),
            value: row.value,
            id: row.name,
        })
    );

    return { data: websiteData, error: null };
};

export const updateDbWebsiteData = async (
    row: WebsiteDataRow
): Promise<UpdateWebsiteDataErrorReturn> => {
    const processedData: DbWebsiteData = {
        name: row.dbName,
        value: row.value,
    };

    const { data: updateWebsiteData, error } = await supabase
        .from("website_data")
        .update(processedData)
        .eq("name", processedData.name)
        .select()
        .single();

    const auditLog = {
        action: "update website data",
        content: processedData,
        websiteData: processedData.name,
    } as const satisfies Partial<AuditLog>;

    if (error) {
        const logId = await logErrorReturnLogId("Error with update: website data", error);
        void sendAuditLog({ ...auditLog, wasSuccess: false, logId });
        return { error: { type: "Failed to update website data", logId } };
    }
    void sendAuditLog({ ...auditLog, wasSuccess: true, content: updateWebsiteData });
    return { error: null };
};
