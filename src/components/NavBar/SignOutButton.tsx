import React from "react";
import IconButton from "@mui/material/IconButton";
import LogoutIcon from "@mui/icons-material/Logout";
import { useRouter } from "next/navigation";

const SignOutButton: React.FC<{}> = () => {
    const router = useRouter();

    const handleSignOutClick = (): void => {
        fetch("/auth/signout", {
            method: "POST",
        }).then(() => {
            router.push("/login");
        });
    };

    return (
        <IconButton
            size="medium"
            aria-label="Sign Out Button"
            id="nav-sign-out"
            onClick={handleSignOutClick}
        >
            <LogoutIcon />
        </IconButton>
    );
};

export default SignOutButton;
