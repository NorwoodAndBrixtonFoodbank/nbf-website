// @ts-nocheck (for Deno references, annoyingly cannot get around for now)
/* global Deno */

import { type Handler, serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@latest";
import { corsHeaders } from "../_shared/cors.ts";

import supabase from "@/supabase";

serve(async (req: Handler): Promise<Response> => {
    const generateHeaders = (status: number): any => ({
        ...corsHeaders,
        "Content-Type": "application/json",
        status,
    });

    // -- Prevent Non-Admin Access -- //
    const {
        data: { session },
        error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
        return new Response(
            JSON.stringify({ error: error.message }),
            generateHeaders(error.status ?? 400)
        );
    }

    if (session === null) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), generateHeaders(401));
    }

    if (session.user.app_metadata.role !== "admin") {
        return new Response(JSON.stringify({ error: "Unauthorized" }), generateHeaders(403));
    }

    // -- Process Request -- //
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"); // TODO ADD KEY

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
        // TODO What does this do?
        global: {
            headers: {
                Authorization: req.headers.get("Authorization")!,
            },
        },
    });

    const { data, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            generateHeaders(error.status ?? 400)
        );
    }

    return new Response(JSON.stringify(data.users), generateHeaders(200));
});
