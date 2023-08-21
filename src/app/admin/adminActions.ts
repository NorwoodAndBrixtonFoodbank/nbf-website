"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { FunctionsResponse } from "@supabase/functions-js/src/types";

const supabase = createServerActionClient({ cookies });

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
