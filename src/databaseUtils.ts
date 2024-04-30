import { Database } from "@/databaseTypesFile";

export type DatabaseAutoType = Database;

type Tables = Database["public"]["Tables"];
type Views = Database["public"]["Views"];

export type Schema = {
    [key in keyof Tables]: Tables[key]["Row"];
};

export type InsertSchema = {
    [key in keyof Tables]: Tables[key]["Insert"];
};

export type UpdateSchema = {
    [key in keyof Tables]: Tables[key]["Update"];
};

export type DatabaseEnums = Database["public"]["Enums"];
export type UserRole = DatabaseEnums["role"];

export type ViewSchema = {
    [key in keyof Views]: Views[key]["Row"];
};

export type TableNames = keyof Tables;

export type ViewNames = keyof Views;

export type ParcelsPlusRow = Views["parcels_plus"]["Row"];

export type ParcelStatus = Schema["status_order"]["event_name"];

export type AuditLogPlusRow = ViewSchema["audit_log_plus"];
