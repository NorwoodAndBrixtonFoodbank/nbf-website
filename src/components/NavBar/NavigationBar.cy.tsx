import React from "react";
import NavigationBar from "@/components/NavBar/NavigationBar";
import { AppRouterContext, AppRouterInstance } from "next/dist/shared/lib/app-router-context";

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
            <NavigationBar />
        </AppRouterContext.Provider>
    );

    it("Renders on desktop", () => {
        cy.viewport(1280, 800);
        cy.mount(RouterWrappedNavBar);
    });

    it("Renders on mobile", () => {
        cy.viewport(375, 667);
        cy.mount(RouterWrappedNavBar);
    });

    it("Links exist on desktop", () => {
        cy.viewport(1280, 800);
        cy.mount(RouterWrappedNavBar);

        cy.get("a[href='/clients']").contains("Clients").should("exist");
        cy.get("a[href='/lists']").contains("Lists").should("exist");
        cy.get("a[href='/calendar']").contains("Calendar").should("exist");
    });

    it("Links exist on mobile", () => {
        cy.viewport(375, 667);
        cy.mount(RouterWrappedNavBar);

        cy.get("button[aria-label='Mobile Menu Button']").click();
        cy.get("a[href='/clients']").contains("Clients").should("exist");
        cy.get("a[href='/lists']").contains("Lists").should("exist");
        cy.get("a[href='/calendar']").contains("Calendar").should("exist");
    });

    it("Mobile Menu Button doesn't show up on Desktop and Drawer is not open", () => {
        cy.viewport(1280, 800);
        cy.mount(RouterWrappedNavBar);

        cy.get("button[aria-label='Mobile Menu Button']").should("not.be.visible");
        cy.get("button").contains("Clients").filter(":visible").should("have.length", 1);
        cy.get("button").contains("Lists").filter(":visible").should("have.length", 1);
        cy.get("button").contains("Calendar").filter(":visible").should("have.length", 1);
    });

    it("Desktop Buttons don't show up on Mobile", () => {
        cy.viewport(375, 667);
        cy.mount(RouterWrappedNavBar);

        cy.get("button").contains("Clients").should("not.be.visible");
        cy.get("button").contains("Lists").should("not.be.visible");
        cy.get("button").contains("Calendar").should("not.be.visible");
    });
});
