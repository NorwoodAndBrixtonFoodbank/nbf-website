"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { DatabaseAutoType } from "@/supabase";

export const AuthRouting: React.FC<{ children: React.ReactNode }> = ({ children = <></> }) => {
    const supabase = createClientComponentClient<DatabaseAutoType>();
    const router = useRouter();
    const pathname = usePathname();
    const [loggedIn, setLoggedIn] = React.useState<boolean>();

    // This fixes issues with navigation when the user has signed in but then signed out and caching still allows them to
    // access pages. It also fixes authentication flow issues on sign in and sign out
    const toRedirectTo = (): string | null => {
        const pathname = window.location.pathname;

        if (loggedIn === undefined) {
            return null;
        }

        if (loggedIn && pathname.startsWith("/login")) {
            return "/clients";
        }
        if (!loggedIn && !pathname.startsWith("/login")) {
            return "/login";
        }
        return null;
    };

    const onRouteChange = (): void => {
        const redirect = toRedirectTo();
        if (redirect) {
            router.push(redirect);

            // if Client Side Routing is not working, fallback to changing the window location
            // This seemingly only happens on GH Actions
            setTimeout(() => {
                const redirect = toRedirectTo();
                if (redirect) {
                    window.location.pathname = redirect;
                }
            }, 500);
        }
    };

    useEffect(() => {
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setLoggedIn(!!session?.user);
        });

        return subscription.unsubscribe;
    });

    useEffect(() => {
        onRouteChange();
        // eslint-disable-next-line react-hooks/exhaustive-deps -- We don't need onRouteChange in the dependency array
    }, [loggedIn, pathname, router]);

    return <>{children}</>;
};
