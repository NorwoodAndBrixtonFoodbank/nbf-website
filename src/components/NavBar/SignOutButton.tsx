import React from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import { useRouter } from "next/navigation";
import IconButton from "@mui/material/IconButton/IconButton";

const SignOutButton: React.FC = () => {
    const router = useRouter();

    const handleSignOutClick = (): void => {
        fetch("/auth/signout", {
            method: "POST",
        }).then(() => {
            router.push("/login");
        });
    };

    return (
        <IconButton color="secondary" aria-label="Sign Out Button" onClick={handleSignOutClick}>
            <LogoutIcon />
        </IconButton>
    );
};

export default SignOutButton;
