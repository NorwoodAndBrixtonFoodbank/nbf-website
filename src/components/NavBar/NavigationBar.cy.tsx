"use client";

import React from "react";
import NavigationBar from "@/components/NavBar/NavigationBar";
import { AppRouterContext, AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import StyleManager from "@/app/themes";
const StyledNavigationBar: React.FC = () => {
    return (
        <StyleManager>
            <NavigationBar />
        </StyleManager>
    );
};
describe("<NavigationBar />", () => {
    const router: AppRouterInstance = {
        push: () => {},
        back: () => {},
        forward: () => {},
        replace: () => {},
        prefetch: () => {},
        refresh: () => {},
    };

    const RouterWrappedNavBar = (
        <AppRouterContext.Provider value={router}>
            <StyledNavigationBar />
        </AppRouterContext.Provider>
    );

    it("Renders on desktop", () => {
        cy.viewport(1366, 768);
        cy.mount(RouterWrappedNavBar);
    });

    it("Renders on mobile", () => {
        cy.viewport(360, 760);
        cy.mount(RouterWrappedNavBar);
    });

    it("Links exist on desktop", () => {
        cy.viewport(1366, 768);
        cy.mount(RouterWrappedNavBar);

        cy.get("a[href='/clients']").contains("CLIENTS").should("exist");
        cy.get("a[href='/lists']").contains("LISTS").should("exist");
        cy.get("a[href='/calendar']").contains("CALENDAR").should("exist");
    });

    it("Links exist on mobile", () => {
        cy.viewport(360, 760);
        cy.mount(RouterWrappedNavBar);

        cy.get("button[aria-label='Mobile Menu Button']").click();
        cy.get("a[href='/clients']").contains("CLIENTS").should("exist");
        cy.get("a[href='/lists']").contains("LISTS").should("exist");
        cy.get("a[href='/calendar']").contains("CALENDAR").should("exist");
    });

    it("Mobile Menu Button doesn't show up on Desktop and Drawer is not open", () => {
        cy.viewport(1366, 768);
        cy.mount(RouterWrappedNavBar);

        cy.get("button[aria-label='Mobile Menu Button']").should("not.be.visible");
        cy.get("button").contains("CLIENTS").filter(":visible").should("have.length", 1);
        cy.get("button").contains("LISTS").filter(":visible").should("have.length", 1);
        cy.get("button").contains("CALENDAR").filter(":visible").should("have.length", 1);
    });

    it("Desktop Buttons don't show up on Mobile", () => {
        cy.viewport(360, 760);
        cy.mount(RouterWrappedNavBar);

        cy.get("button").contains("CLIENTS").should("not.be.visible");
        cy.get("button").contains("LISTS").should("not.be.visible");
        cy.get("button").contains("CALENDAR").should("not.be.visible");
    });
});
