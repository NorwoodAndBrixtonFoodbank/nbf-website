"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { FunctionsResponse } from "@supabase/functions-js/src/types";
import { User } from "@supabase/gotrue-js";
import { Datum } from "@/components/Tables/Table";

const supabase = createServerActionClient({ cookies });

export interface UserRow extends Datum {
    id: string;
    email: string;
    userRole: "admin" | "caller";
    createdAt: number;
    updatedAt: number;
}

export const getUsers = async (): Promise<UserRow[]> => {
    const { data, error } = await supabase.functions.invoke("admin-get-users");

    if (error) {
        return [];
    }

    const users: User[] = JSON.parse(data);

    return users.map((user: User) => {
        return {
            id: user.id,
            email: user.email ?? "-",
            userRole: user.app_metadata.role,
            createdAt: Date.parse(user.created_at),
            updatedAt: Date.parse(user.updated_at ?? ""),
        };
    });
};

export const createUser = async (fields: any): Promise<FunctionsResponse<any>> => {
    return await supabase.functions.invoke("admin-create-user", {
        body: JSON.stringify(fields),
    });
};

export const deleteUser = async (userId: string): Promise<FunctionsResponse<any>> => {
    return await supabase.functions.invoke("admin-delete-user", {
        body: JSON.stringify({ userId }),
    });
};
