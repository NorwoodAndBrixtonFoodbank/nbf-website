"use client";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import ProfilePicture from "@/components/NavBar/ProfilePicture";
import MobileNavigationMenu from "@/components/NavBar/MobileNavigationMenu";
import NoStyleLink from "@/components/NavBar/NoStyleLink";

const Logo = styled.img`
    max-width: 100%;
    max-height: 100%;
    align-content: center;
`;

const LogoDiv = styled.div`
    background-color: white;
    border-radius: 10px;
    overflow: hidden;
    padding: 2px 2px;
    box-shadow: 2px 2px 5px #60ae2d;
    width: 115px;
    height: 50px;
    display: flex;
    justify-content: center;
    margin: 10px;
`;

const DesktopDiv = styled.div`
    @media (min-width: 800px) {
        display: flex;
        flex-direction: row;
        flex-grow: 1;
        justify-content: space-between;
        align-content: center;
        align-items: center;
    }

    @media (max-width: 799px) {
        display: none;
    }
`;

const MobileDiv = styled.div`
    @media (min-width: 800px) {
        display: none;
    }

    @media (max-width: 799px) {
        display: flex;
        flex-direction: row;
        flex-grow: 1;
        justify-content: space-between;
        align-content: center;
        align-items: center;
`;

const StyledAppBar = styled(AppBar)`
    background-color: green;
    position: sticky;
    padding: 5px;
`;

const ProfilePictureDiv = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const PageButton = styled(Button)`
    color: white;
    font-size: 1.25rem;
    margin: 10px;
    &:hover {
        background-color: #60ae2d;
    }
`;

const PageButtonsDiv = styled.div`
    display: flex;
    align-items: baseline;
`;

const NavigationBar: React.FC<{}> = () => {
    const pages: [string, string][] = [
        ["Clients", "/clients"],
        ["Lists", "/lists"],
        ["Calendar", "/calendar"],
    ];

    const [mobileNavPosition, setMobileNavPosition] = React.useState<null | HTMLElement>(null);

    const handleOpenMobileNavMenu = (event: React.MouseEvent<HTMLElement>): void => {
        setMobileNavPosition(event.currentTarget);
    };

    const handleCloseNavMenu = (): void => {
        setMobileNavPosition(null);
    };

    return (
        <StyledAppBar>
            <MobileDiv>
                <Box>
                    <IconButton size="large" onClick={handleOpenMobileNavMenu} color="inherit">
                        <FontAwesomeIcon icon={faBars} />
                    </IconButton>
                    <MobileNavigationMenu
                        pages={pages}
                        mobileNavPosition={mobileNavPosition}
                        setMobileNavPosition={setMobileNavPosition}
                    />
                </Box>

                <LogoDiv>
                    <Logo alt="Vauxhall Foodbank Logo" src="/logo.png" />
                </LogoDiv>

                <ProfilePictureDiv>
                    <ProfilePicture />
                </ProfilePictureDiv>
            </MobileDiv>

            <DesktopDiv>
                <LogoDiv>
                    <Logo alt="Vauxhall Foodbank Logo" src="/logo.png" />
                </LogoDiv>

                <PageButtonsDiv>
                    {pages.map(([page, link]) => (
                        <NoStyleLink href={link} key={page}>
                            <PageButton onClick={handleCloseNavMenu}>{page}</PageButton>
                        </NoStyleLink>
                    ))}
                </PageButtonsDiv>

                <ProfilePictureDiv>
                    <ProfilePicture />
                </ProfilePictureDiv>
            </DesktopDiv>
        </StyledAppBar>
    );
};
export default NavigationBar;
