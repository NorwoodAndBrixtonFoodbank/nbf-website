import React from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";

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
        <Button color="secondary" aria-label="Sign Out Button" onClick={handleSignOutClick}>
            <LogoutIcon />
        </Button>
    );
};

export default SignOutButton;
