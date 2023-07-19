import React from "react";
import { useRouter } from "next/navigation";
import { PageButton } from "@/components/NavBar/NavigationBar";

const SignOutButton: React.FC<{}> = () => {
    const router = useRouter();

    const handleSignOutClick = (): void => {
        fetch("/auth/signout", {
            method: "POST",
        }).then(() => {
            router.push("/login");
        });
    };

    return <PageButton onClick={handleSignOutClick}>Sign Out</PageButton>;
};

export default SignOutButton;
