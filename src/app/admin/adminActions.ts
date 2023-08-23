"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { FunctionsResponse } from "@supabase/functions-js/src/types";
import { AdminUserAttributes } from "@supabase/gotrue-js";

const supabase = createServerActionClient({ cookies });

// TODO VFB-23 Unpack Supabase Errors and Extract Only Relavent Fields to Return to Client

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
