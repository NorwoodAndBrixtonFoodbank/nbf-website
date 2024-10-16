import { Database } from "@/databaseTypesFile";

export type ListType = Database["public"]["Enums"]["list_type"];

export const LIST_TYPES_ARRAY: ListType[] = ["regular", "hotel"] as const;

export type ListTypeLabelsAndValues = [string, string][];
