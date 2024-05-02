import { TableHeaders } from "@/components/Tables/Table";
import { UserRow } from "./types";

export const usersTableHeaderKeysAndLabels: TableHeaders<UserRow> = [
    ["userId", "User ID"],
    ["firstName", "First Name"],
    ["lastName", "Last Name"],
    ["email", "Email"],
    ["userRole", "Role"],
    ["telephoneNumber", "Telephone Number"],
    ["createdAt", "Created At"],
    ["updatedAt", "Updated At"],
];

export const formatTimestamp = (timestamp: number): string => {
    if (isNaN(timestamp)) {
        return "-";
    }

    return new Date(timestamp).toLocaleString("en-gb");
};

export const userTableColumnDisplayFunctions = {
    createdAt: (createdAt: number | null) => {
        return createdAt === null ? "-" : formatTimestamp(createdAt);
    },
    updatedAt: (updatedAt: number | null) => {
        return updatedAt === null ? "-" : formatTimestamp(updatedAt);
    },
};
