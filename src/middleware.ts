import { DatabaseAutoType, UserRole } from "@/databaseUtils";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextMiddleware, NextRequest, NextResponse } from "next/server";
import { roleCanAccessPage, pathsNotRequiringLogin } from "@/app/roles";
import { fetchUserRole } from "@/common/fetchUserRole";

const middleware: NextMiddleware = async (req: NextRequest) => {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient<DatabaseAutoType>({ req, res });

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (req.nextUrl.pathname.startsWith("/auth")) {
        return res;
    }

    const currentPathRequiresLogin = pathsNotRequiringLogin.every(
        (pathNotRequiringLogin) => !req.nextUrl.pathname.startsWith(pathNotRequiringLogin)
    );

    if (!user && currentPathRequiresLogin) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    if (user && req.nextUrl.pathname === "/login") {
        return NextResponse.redirect(new URL("/", req.url));
    }

    let userRole: UserRole | null;

    if (user === null) {
        userRole = null;
    } else {
        const { role, error } = await fetchUserRole(user.id);
        if (error) {
            userRole = null;
        } else {
            userRole = role;
        }
    }

    if (!roleCanAccessPage(userRole, req.nextUrl.pathname)) {
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
         * - logo.* (logo images for navbar and pdfs)
         */
        "/((?!_next/static|_next/image|favicon.ico|logo.*).*)",
    ],
};

export default middleware;
