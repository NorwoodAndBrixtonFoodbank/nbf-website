"use client";

import React, { useContext } from "react";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Link from "next/link";
import { styled } from "styled-components";
import Button from "@mui/material/Button";
import LightDarkSlider from "./LightDarkSlider";
import { ThemeUpdateContext } from "@/app/themes";
import SignOutButton from "./SignOutButton";

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

const Logo = styled.img`
    max-width: 100%;
    max-height: 100%;
    align-content: center;
`;

const LogoDiv = styled.div`
    background-color: transparent;
    border-radius: 10px;
    margin: 10px 20px;
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

const SmallNavBarElement = styled.div`
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
    align-items: center;

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
    <UnstyledLink href="/">
        <LogoDiv>
            <Logo alt="Vauxhall Foodbank Logo" src="/logo.webp" />
        </LogoDiv>
    </UnstyledLink>
);

const Gap = styled.div`
    width: 1rem;
`;

const DrawerButtonWrapper = styled.div`
    padding: 1rem;
    border-bottom: 1px solid ${(props) => props.theme.secondaryBackgroundColor};

    &:last-child {
        border-bottom: none;
    }
`;

const DrawerButton = styled(Button)`
    width: 100%;
    color: ${(props) => props.theme.secondaryBackgroundColor};
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

    const setThemeMode = useContext(ThemeUpdateContext);

    const switchThemeMode = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setThemeMode(event.target.checked);
    };

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
                    <SmallNavBarElement>
                        <IconButton
                            size="medium"
                            aria-label="Mobile Menu Button"
                            onClick={openDrawer}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Spacer />
                    </SmallNavBarElement>
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
                        <LightDarkSlider onChange={switchThemeMode} key="light/dark mode switch" />
                        <Gap />
                        <SignOutButton />
                    </LgNavElement>
                    <SmallNavBarElement>
                        <Spacer />
                        <LightDarkSlider onChange={switchThemeMode} key="light/dark mode switch" />
                        <SignOutButton />
                    </SmallNavBarElement>
                </AppBarInner>
            </AppBar>
        </>
    );
};
export default ResponsiveAppBar;
