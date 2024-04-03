"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { FunctionsResponse } from "@supabase/functions-js/src/types";
import { AdminUserAttributes } from "@supabase/gotrue-js";
import { UserResponse } from "@supabase/supabase-js";
import { Database } from "@/databaseTypesFile";

const supabase = createServerActionClient(
    { cookies },
    { supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY }
);

// TODO VFB-23 Unpack Supabase Errors and Extract Only Relevant Fields to Return to Client

export const inviteUser = async (
    email: string,
    role: Database["public"]["Enums"]["role"],
    redirectUrl: string
): Promise<UserResponse> => {
    return await supabase.auth.admin.inviteUserByEmail(email, { redirectTo: redirectUrl });
};

export const deleteUser = async (userId: string): Promise<FunctionsResponse<any>> => {
    return await supabase.functions.invoke("admin-delete-user", {
        body: JSON.stringify({ userId }),
    });
};

interface UpdateUserRequestBody {
    userId: string;
    attributes: AdminUserAttributes;
}

export const updateUser = async (
    userDetails: UpdateUserRequestBody
): Promise<FunctionsResponse<any>> => {
    return await supabase.functions.invoke("admin-update-user", {
        body: JSON.stringify(userDetails),
    });
};
