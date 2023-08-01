"use client";

import React from "react";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Link from "next/link";
import { styled } from "styled-components";
import Button from "@mui/material/Button";
import LightDarkSlider from "@/components/NavBar/LightDarkSlider";
import SignOutButton from "@/components/NavBar/SignOutButton";

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

const AppBarInner = styled.div`
    display: flex;
    height: 4rem;
    padding: 0.5rem;
`;

const DrawerInner = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: stretch;
    padding: 1rem;
    width: 15rem;
`;

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
    color: ${(props) => props.theme.secondaryBackgroundColor};
`;

const StickyAppBar = styled(AppBar)`
    position: sticky;
`;

const NavElementContainer = styled.div`
    display: flex;
    flex-basis: 0;
    flex-grow: 1;
    justify-content: center;
    align-items: center;
`;

const MobileNavMenuContainer = styled(NavElementContainer)`
    justify-content: start;
    @media (min-width: 800px) {
        display: none;
    }
`;

const LogoElementContainer = styled(NavElementContainer)`
    justify-content: center;
    height: 100%;
    object-fit: cover;
    @media (min-width: 800px) {
        justify-content: start;
    }
`;

const ButtonContainer = styled(NavElementContainer)`
    display: none;
    @media (min-width: 800px) {
        display: flex;
    }
`;

const SignOutButtonContainer = styled(NavElementContainer)`
    justify-content: end;
`;

const ResponsiveAppBar: React.FC = () => {
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
                            <UnstyledLink href={link} onClick={closeDrawer} prefetch={false}>
                                <DrawerButton variant="text">{page}</DrawerButton>
                            </UnstyledLink>
                        </DrawerButtonWrapper>
                    ))}
                </DrawerInner>
            </SwipeableDrawer>
            <StickyAppBar>
                <AppBarInner>
                    <MobileNavMenuContainer>
                        <IconButton aria-label="Mobile Menu Button" onClick={openDrawer}>
                            <MenuIcon />
                        </IconButton>
                    </MobileNavMenuContainer>
                    <LogoElementContainer>
                        <UnstyledLink href="/" prefetch={false}>
                            <Logo alt="Vauxhall Foodbank Logo" src="/logo.webp" />
                        </UnstyledLink>
                    </LogoElementContainer>
                    <ButtonContainer>
                        {pages.map(([page, link]) => (
                            <>
                                <UnstyledLink
                                    key={page}
                                    href={link}
                                    onClick={closeDrawer}
                                    prefetch={false}
                                >
                                    <Button variant="outlined" color="secondary">
                                        {page}
                                    </Button>
                                </UnstyledLink>
                                <Gap />
                            </>
                        ))}
                    </ButtonContainer>
                    <SignOutButtonContainer>
                        <LightDarkSlider />
                        <Gap />
                        <SignOutButton />
                    </SignOutButtonContainer>
                </AppBarInner>
            </StickyAppBar>
        </>
    );
};
export default ResponsiveAppBar;
