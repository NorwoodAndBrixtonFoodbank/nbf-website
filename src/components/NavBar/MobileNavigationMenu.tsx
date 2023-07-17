import React from "react";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import NoStyleLink from "@/components/NavBar/NoStyleLink";

interface Props {
    pages: [pageName: string, url: string][];
    mobileNavPosition: HTMLElement | null;
    setMobileNavPosition: (position: HTMLElement | null) => void;
}

const MobileNavigationMenu: React.FC<Props> = (props) => {
    const handleCloseNavMenu = (): void => {
        props.setMobileNavPosition(null);
    };

    return (
        <Menu
            id="menu-appbar"
            anchorEl={props.mobileNavPosition}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
            }}
            keepMounted
            transformOrigin={{
                vertical: "top",
                horizontal: "left",
            }}
            open={Boolean(props.mobileNavPosition)}
            onClose={handleCloseNavMenu}
        >
            {props.pages.map(([page, link]) => (
                <NoStyleLink key={page} href={link}>
                    <MenuItem onClick={handleCloseNavMenu}>
                        <Typography textAlign="center">{page}</Typography>
                    </MenuItem>
                </NoStyleLink>
            ))}
        </Menu>
    );
};
export default MobileNavigationMenu;
