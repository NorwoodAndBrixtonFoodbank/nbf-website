import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextMiddleware, NextRequest, NextResponse } from "next/server";

// See https://supabase.com/docs/guides/auth/auth-helpers/nextjs

export const GET: NextMiddleware = async (req: NextRequest) => {
    const supabase = createRouteHandlerClient({ cookies });
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (code) {
        await supabase.auth.exchangeCodeForSession(code);
    }

    return NextResponse.redirect(new URL("/clients", req.url));
};
