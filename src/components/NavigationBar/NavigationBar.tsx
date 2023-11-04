"use client";

import React, { useContext } from "react";
import AppBar from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Link from "next/link";
import styled from "styled-components";
import Button from "@mui/material/Button";
import LightDarkSlider from "@/components/NavigationBar/LightDarkSlider";
import SignOutButton from "@/components/NavigationBar/SignOutButton";
import NavBarButton from "@/components/Buttons/NavBarButton";
import { usePathname } from "next/navigation";
import { RoleUpdateContext, roleCanAccessPage } from "@/app/roles";

export const NavBarHeight = "4rem";

const StyledSwipeableDrawer = styled(SwipeableDrawer)`
    & .MuiPaper-root {
        background-image: none;
    }
`;

const UnstyledLink = styled(Link)`
    text-decoration: none;
    display: contents;
`;

const Logo = styled.img`
    max-width: 100%;
    max-height: 100%;
`;

const AppBarInner = styled.div`
    display: flex;
    height: ${NavBarHeight};
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

const DrawerButtonWrapper = styled.div`
    padding: 0.7rem;
    border-bottom: 1px solid ${(props) => props.theme.main.foreground[3]};

    &:last-child {
        border-bottom: none;
    }
`;

const DrawerButton = styled(Button)`
    text-transform: uppercase;
    width: 100%;
`;

const NavElementContainer = styled.div`
    display: flex;
    flex-basis: 0;
    flex-grow: 1;
    justify-content: center;
    align-items: center;
    margin: 0 1em;
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

const DesktopButtonContainer = styled(NavElementContainer)`
    display: none;
    @media (min-width: 800px) {
        display: flex;
        gap: 1rem;
    }
`;

const SignOutButtonContainer = styled(NavElementContainer)`
    justify-content: end;
    gap: 1rem;
`;

const LoginDependent: React.FC<Props> = (props) => {
    const pathname = usePathname();
    if (pathname === "/login") {
        return <></>;
    }
    return <>{props.children}</>;
};

interface Props {
    children?: React.ReactNode;
}

interface RoleProps {
    children?: React.ReactNode;
    pathname: string;
}

const RoleDependent: React.FC<RoleProps> = ({ children, pathname }) => {
    const { role } = useContext(RoleUpdateContext);

    return <>{roleCanAccessPage(role, pathname) && children}</>;
};

const pages = [
    ["Parcels", "/parcels"],
    ["Clients", "/clients"],
    ["Lists", "/lists"],
    ["Calendar", "/calendar"],
    ["Admin", "/admin"],
];

const NavigationBar: React.FC<Props> = ({ children }) => {
    const [drawer, setDrawer] = React.useState(false);

    const openDrawer = (): void => {
        setDrawer(true);
    };

    const closeDrawer = (): void => {
        setDrawer(false);
    };

    return (
        <>
            <LoginDependent>
                <StyledSwipeableDrawer open={drawer} onClose={closeDrawer} onOpen={openDrawer}>
                    <DrawerInner>
                        {pages.map(([page, link]) => (
                            <RoleDependent key={page} pathname={link}>
                                <DrawerButtonWrapper>
                                    <UnstyledLink
                                        href={link}
                                        onClick={closeDrawer}
                                        prefetch={false}
                                    >
                                        <DrawerButton variant="text">{page}</DrawerButton>
                                    </UnstyledLink>
                                </DrawerButtonWrapper>
                            </RoleDependent>
                        ))}
                    </DrawerInner>
                </StyledSwipeableDrawer>
            </LoginDependent>
            <AppBar>
                <AppBarInner>
                    <MobileNavMenuContainer>
                        <Button
                            color="secondary"
                            aria-label="Mobile Menu Button"
                            onClick={openDrawer}
                        >
                            <MenuIcon />
                        </Button>
                    </MobileNavMenuContainer>
                    <LogoElementContainer>
                        <UnstyledLink href="/" prefetch={false}>
                            <Logo alt="Vauxhall Foodbank Logo" src="/logo.webp" />
                        </UnstyledLink>
                    </LogoElementContainer>
                    <DesktopButtonContainer>
                        {pages.map(([page, link]) => (
                            <RoleDependent key={page} pathname={link}>
                                <NavBarButton link={link} page={page} />
                            </RoleDependent>
                        ))}
                    </DesktopButtonContainer>
                    <SignOutButtonContainer>
                        <LightDarkSlider />
                        <LoginDependent>
                            <SignOutButton />
                        </LoginDependent>
                    </SignOutButtonContainer>
                </AppBarInner>
            </AppBar>
            {children}
        </>
    );
};
export default NavigationBar;
