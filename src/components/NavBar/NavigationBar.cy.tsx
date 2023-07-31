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
        cy.viewport(1367, 1500);
        cy.mount(RouterWrappedNavBar);
    });

    it("Renders on mobile", () => {
        cy.viewport(360, 1000);
        cy.mount(RouterWrappedNavBar);
    });

    it("Links exist on desktop", () => {
        cy.viewport(1367, 1500);
        cy.mount(RouterWrappedNavBar);

        cy.get("a[href='/clients']").contains("Clients").should("exist");
        cy.get("a[href='/lists']").contains("Lists").should("exist");
        cy.get("a[href='/calendar']").contains("Calendar").should("exist");
    });

    it("Links exist on mobile", () => {
        cy.viewport(360, 1000);
        cy.mount(RouterWrappedNavBar);

        cy.get("button[aria-label='Mobile Menu Button']").click();
        cy.get("a[href='/clients']").contains("Clients").should("exist");
        cy.get("a[href='/lists']").contains("Lists").should("exist");
        cy.get("a[href='/calendar']").contains("Calendar").should("exist");
    });
});
