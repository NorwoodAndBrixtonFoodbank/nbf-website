"use client";

import React from "react";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Link from "next/link";
import { styled } from "styled-components";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";

export const PageButton = styled(Button)`
    color: white;
    font-size: 1.25rem;
    margin: 10px;
    &:hover {
        background-color: ${(props) => props.theme.primaryBackgroundColor};
    }
`;

const UnstyledLink = styled(Link)`
    text-decoration: none;
    display: contents;
`;

const LogoLink = styled(UnstyledLink)`
    display: contents;
`;

const Logo = styled.img`
    max-width: 100%;
    max-height: 100%;
    align-content: center;
`;

const LogoDiv = styled.div`
    background-color: white;
    border-radius: 10px;
    overflow: hidden;
    padding: 2px;
    box-shadow: 2px 2px 5px ${(props) => props.theme.primaryBackgroundColor};
    display: flex;
    justify-content: center;
    flex-basis: auto;
    margin: 10px 0;
    height: 80%;
    object-fit: cover;
`;

const AppBarInner = styled.div`
    display: flex;
    height: 4rem;
    justify-content: space-between;
    align-items: center;
    padding: 0 0.5rem;
`;

const SmSideElement = styled.div`
    display: flex;
    align-items: center;
    width: 8rem;

    @media (min-width: 800px) {
        display: none;
    }
`;

const LgNavElement = styled.div`
    display: none;
    flex-grow: 1;
    justify-content: end;
    gap: 1rem;

    @media (min-width: 800px) {
        display: flex;
    }
`;

const Spacer = styled.div`
    flex-grow: 1;
`;

const DrawerInner = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: stretch;
    padding: 1rem;
    width: 15rem;
`;

const LogoNavElement: React.FC<{}> = () => (
    <LogoLink href="/">
        <LogoDiv>
            <Logo alt="Vauxhall Foodbank Logo" src="/logo.png" />
        </LogoDiv>
    </LogoLink>
);

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

const Gap = styled.div`
    width: 1rem;
`;

const DrawerButtonWrapper = styled.div`
    padding: 1rem;
    border-bottom: 1px solid ${(props) => props.theme.primaryBackgroundColor};

    &:last-child {
        border-bottom: none;
    }
`;

const DrawerButton = styled(Button)`
    width: 100%;
`;

const ResponsiveAppBar: React.FC<{}> = () => {
    const [drawer, setDrawer] = React.useState(false);

    const openDrawer = (): void => {
        setDrawer(true);
    };

    const closeDrawer = (): void => {
        setDrawer(false);
    };

    const pages = [
        ["Clients", "/clients"],
        ["Lists", "/lists"],
        ["Calendar", "/calendar"],
    ];

    return (
        <>
            <SwipeableDrawer open={drawer} onClose={closeDrawer} onOpen={openDrawer}>
                <DrawerInner>
                    {pages.map(([page, link]) => (
                        <DrawerButtonWrapper key={page}>
                            <UnstyledLink href={link} onClick={closeDrawer}>
                                <DrawerButton variant="text">{page}</DrawerButton>
                            </UnstyledLink>
                        </DrawerButtonWrapper>
                    ))}
                </DrawerInner>
            </SwipeableDrawer>
            <AppBar position="static">
                <AppBarInner>
                    <SmSideElement>
                        <IconButton
                            size="medium"
                            aria-label="Mobile Menu Button"
                            onClick={openDrawer}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Spacer />
                    </SmSideElement>
                    <LogoNavElement />
                    {/* TODO: VFB-16 need to fix nav colours */}
                    <LgNavElement>
                        {pages.map(([page, link]) => (
                            <UnstyledLink key={page} href={link} onClick={closeDrawer}>
                                <Button variant="outlined" color="secondary">
                                    {page}
                                </Button>
                            </UnstyledLink>
                        ))}
                        <Gap />
                        <SignOutButton />
                    </LgNavElement>
                    <SmSideElement>
                        <Spacer />
                        <SignOutButton />
                    </SmSideElement>
                </AppBarInner>
            </AppBar>
        </>
    );
};
export default ResponsiveAppBar;
