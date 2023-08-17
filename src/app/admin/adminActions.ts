"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const supabase = createServerActionClient({ cookies });

export const createUser = async (fields: any) => {
    // TODO ADD TYPES
    return await supabase.functions.invoke("admin-create-user", {
        body: JSON.stringify(fields),
    });
};
