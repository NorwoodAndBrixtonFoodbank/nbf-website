"use client";

import React from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import { DatabaseAutoType } from "@/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import IconButton from "@mui/material/IconButton/IconButton";

const SignOutButton: React.FC = () => {
    const supabase = createClientComponentClient<DatabaseAutoType>();
    // const router = useRouter();

    // useEffect(() => {
    //     const {
    //         data: { subscription },
    //     } = supabase.auth.onAuthStateChange((event, session) => {
    //         if (!session) {
    //             router.push("/login");
    //         }
    //     });
    //     return subscription.unsubscribe;
    // });

    return (
        <IconButton
            aria-label="Sign Out Button"
            onClick={async () => {
                await supabase.auth.signOut();
            }}
        >
            <LogoutIcon />
        </IconButton>
    );
};

export default SignOutButton;
