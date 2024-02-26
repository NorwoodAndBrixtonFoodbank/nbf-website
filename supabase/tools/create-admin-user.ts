import * as dotenv from "dotenv";
import { SupabaseClient } from "@supabase/supabase-js";
import { getLocalSupabaseClient } from "./getLocalSupabaseClient";

dotenv.config({ path: "./.env.local" });

createAdminUser();

type Role = "admin" | "caller";

async function createAdminUser(): Promise<void> {
    const supabase = getLocalSupabaseClient();

    const adminEmail = "admin@example.com";
    const adminPassword = "admin123";
    await createUser(supabase, adminEmail, adminPassword, "admin");
    console.log(`Created an admin user: ${adminEmail} (${adminPassword})`);

    const callerEmail = "caller@example.com";
    const callerPassword = "caller123";
    await createUser(supabase, callerEmail, callerPassword, "caller");
    console.log(`Created a caller user: ${callerEmail} (${callerPassword})`);
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
        throw new Error(`Failed to create ${role} user: ${email}. ${error}`);
    }
}
