import { DatabaseAutoType } from "@/supabase";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextMiddleware, NextRequest, NextResponse } from "next/server";

const middleware: NextMiddleware = async (req: NextRequest) => {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient<DatabaseAutoType>({ req, res });

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (req.nextUrl.pathname.startsWith("/auth")) {
        return res;
    }

    if (!user && req.nextUrl.pathname !== "/login") {
        return NextResponse.redirect(new URL("/login", req.url));
    }
    if (user && req.nextUrl.pathname === "/login") {
        return NextResponse.redirect(new URL("/clients", req.url));
    }
    return res;
};

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - logo.png (so navbar can load on login page)
         */
        "/((?!_next/static|_next/image|favicon.ico|logo.webp).*)",
    ],
};

export default middleware;
