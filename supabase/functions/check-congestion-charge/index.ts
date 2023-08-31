/* eslint-disable import/no-unresolved */
// @ts-nocheck (for Deno references, annoyingly cannot get around for now)
/* global Deno */

import { type Handler, serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@latest";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req: Handler): Promise<Response> => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    const request = await req.json();

    const generateHeaders = (status: number = 200): any => ({
        ...corsHeaders,
        "Content-Type": "application/json",
        status,
    });

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        global: {
            headers: {
                Authorization: req.headers.get("Authorization")!,
            },
        },
    });

    const { data, error } = await supabase.storage
        .from("public")
        .download("public/congestion-zone-postcodes.txt");

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), generateHeaders(400));
    }

    const contents = await data.text();
    const chargedPostcodes = new Set(contents.split("\n"));
    const result = request.postcodes?.map((postcode: string) => ({
        postcode,
        congestionCharge: chargedPostcodes.has(postcode),
    }));

    return new Response(JSON.stringify(result), generateHeaders(200));
});
