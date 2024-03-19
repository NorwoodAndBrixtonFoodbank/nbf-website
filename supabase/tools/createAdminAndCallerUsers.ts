import * as dotenv from "dotenv";
import { SupabaseClient } from "@supabase/supabase-js";
import { getLocalSupabaseClient } from "./getLocalSupabaseClient";

dotenv.config({ path: "./.env.local" });

createAdminAndCallerUsers();

type Role = "admin" | "caller";

async function createAdminAndCallerUsers(): Promise<void> {
    const supabase = getLocalSupabaseClient();

    await createUser(supabase, "admin@example.com", "admin123", "admin");
    await createUser(supabase, "caller@example.com", "caller123", "caller");
}

async function createUser(
    supabase: SupabaseClient,
    email: string,
    password: string,
    role: Role
): Promise<void> {
    const { error } = await supabase.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true,
        phone_confirm: true,
        app_metadata: {
            role: role,
        },
    });

    if (error) {
        console.log(error);
        throw new Error(`Failed to create ${role} user: ${email}. ${error}`);
    }

    console.log(`Created a ${role} user: ${email} (${password})`);
}
