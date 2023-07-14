"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import { useRouter } from "next/navigation";
import styled from "styled-components";

const ProfileSettingsMenu = styled(Menu)`
    margin-top: 50px;
`;

const ProfilePicture: React.FC<{}> = () => {
    const router = useRouter();

    const [profileMenuPosition, setProfileMenuPosition] = React.useState<null | HTMLElement>(null);
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>): void => {
        setProfileMenuPosition(event.currentTarget);
    };
    const handleCloseUserMenu = (): void => {
        setProfileMenuPosition(null);
    };

    const handleSignOutClick = (): void => {
        handleCloseUserMenu();

        fetch("/auth/signout", {
            method: "POST",
        }).then(() => {
            router.push("/login");
        });
    };

    return (
        <Box>
            <Tooltip title="Profile Settings">
                <IconButton onClick={handleOpenUserMenu}>
                    <Avatar />
                </IconButton>
            </Tooltip>
            <ProfileSettingsMenu
                id="menu-appbar"
                anchorEl={profileMenuPosition}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                open={Boolean(profileMenuPosition)} // Renders menu if position is set
                onClose={handleCloseUserMenu}
            >
                <MenuItem onClick={handleSignOutClick}>Sign Out</MenuItem>
            </ProfileSettingsMenu>
        </Box>
    );
};

export default ProfilePicture;
