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
