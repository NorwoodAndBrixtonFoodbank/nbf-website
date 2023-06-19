import { DatabaseAutoType } from "@/supabase";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { constants } from "http2";
import { cookies } from "next/headers";
import { NextMiddleware, NextRequest, NextResponse } from "next/server";
const HTTP_STATUS_FOUND = constants.HTTP_STATUS_FOUND;

export const POST: NextMiddleware = async (req: NextRequest) => {
    const supabase = createRouteHandlerClient<DatabaseAutoType>({ cookies });

    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (session) {
        await supabase.auth.signOut();
    }

    return NextResponse.redirect(new URL("/login", req.url), { status: HTTP_STATUS_FOUND });
};
