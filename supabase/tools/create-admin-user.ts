import * as dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: "./.env.local" });

createAdminUser()

async function createAdminUser() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl) {
        throw new Error('Supabse URL it not specified')
    }

    if (!supabaseKey) {
        throw new Error('Supabase key is not ')
    }

    const supabase = createClient(
        supabaseUrl,
        supabaseKey,
        {
            auth: {
                persistSession: false,
                autoRefreshToken: false
            }
        }
    )

    const { data, error } = await supabase.auth.admin.createUser({
        email: 'Team-VauxhallFoodbank@softwire.com',
        password: 'Test123',
        email_confirm: false,
        phone_confirm: false,
        app_metadata: {
            role: 'admin'
        }
    })

    if (error) {
        console.error(error)
    } else {
        console.log(`Created an admin user: ${data.user?.email}`)
    }
}
