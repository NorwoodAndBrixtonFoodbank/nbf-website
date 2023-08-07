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
    const onRouteChange = (): void => {
        if (loggedIn === undefined) {
            return;
        }

        if (loggedIn) {
            if (pathname.startsWith("/login")) {
                router.push("/clients");
            }
        } else {
            if (pathname !== "/login") {
                router.push("/login");
            }
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
