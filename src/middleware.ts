import { DatabaseAutoType } from "@/databaseUtils";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextMiddleware, NextRequest, NextResponse } from "next/server";
import { roleToShownPages } from "@/app/roles";

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
    const userRole = user?.app_metadata.role;
    const shownPages = roleToShownPages[userRole] ?? ["/login"];
    if (!shownPages.includes(req.nextUrl.pathname)) {
        const url = req.nextUrl;
        url.pathname = "/404";
        return NextResponse.rewrite(url);
    }
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
