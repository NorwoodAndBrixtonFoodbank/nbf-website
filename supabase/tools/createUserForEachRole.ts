import * as dotenv from "dotenv";
import { SupabaseClient } from "@supabase/supabase-js";
import { getLocalSupabaseClient } from "./getLocalSupabaseClient";

dotenv.config({ path: "./.env.local" });

createUserForEachRole();

type Role = "admin" | "volunteer" | "manager" | "staff";

interface userProfile {
    email: string;
    password: string;
    role: Role;
    firstName: string;
    lastName: string;
    telephoneNumber: string;
}

async function createUserForEachRole(): Promise<void> {
    const supabase = getLocalSupabaseClient();

    await createUser(supabase, {
        email: "admin@example.com",
        password: "admin123",
        role: "admin",
        firstName: "admin",
        lastName: "person",
        telephoneNumber: "0777777777777",
    });
    await createUser(supabase, {
        email: "volunteer@example.com",
        password: "volunteer123",
        role: "volunteer",
        firstName: "volunteer",
        lastName: "person",
        telephoneNumber: "020866666666",
    });
    await createUser(supabase, {
        email: "manager@example.com",
        password: "manager123",
        role: "manager",
        firstName: "manager",
        lastName: "person",
        telephoneNumber: "075555555555",
    });
    await createUser(supabase, {
        email: "staff@example.com",
        password: "staff123",
        role: "staff",
        firstName: "staff",
        lastName: "person",
        telephoneNumber: "074444444444",
    });
}

async function createUser(supabase: SupabaseClient, userProfile: userProfile): Promise<void> {
    const { data, error } = await supabase.auth.admin.createUser({
        email: userProfile.email,
        password: userProfile.password,
        email_confirm: true,
    });

    if (error) {
        console.log(error);
        throw new Error(
            `Failed to create ${userProfile.role} user: ${userProfile.email}. ${error}`
        );
    }

    if (data) {
        const nowTimestamp = "2024-07-13T11:04:00.000Z";
        const { error } = await supabase.from("profiles").insert({
            user_id: data.user.id,
            role: userProfile.role,
            first_name: userProfile.firstName,
            last_name: userProfile.lastName,
            telephone_number: userProfile.telephoneNumber,
            email: userProfile.email,
            created_at: nowTimestamp,
        });
        if (error) {
            console.log(
                `Failed to create a profile for ${userProfile.firstName} ${userProfile.lastName}. ${error}`
            );
        }
    }

    console.log(
        `Created a ${userProfile.role} user: ${userProfile.email} (${userProfile.password})`
    );
}
