describe("Responsive navigation bar tests", () => {
    // These are E2E tests because Cypress component tests don't work on NextJS 14 and
    // Jest's DOM provider (jsdom) doesn't have full support for responsive rendering of MUI

    beforeEach(() => {
        cy.login();
        cy.visit("/parcels");
    });

    it("shows only desktop links on desktop", () => {
        cy.viewport(1366, 768);

        cy.get("[data-testid='desktop-buttons']").should("be.visible");
        cy.get("[data-testid='desktop-buttons'] a[href='/parcels']")
            .contains("Parcels")
            .should("be.visible");
        cy.get("[data-testid='desktop-buttons'] a[href='/clients']")
            .contains("Clients")
            .should("be.visible");
        cy.get("[data-testid='desktop-buttons'] a[href='/lists']")
            .contains("Lists")
            .should("be.visible");

        cy.get("button[aria-label='Mobile Menu Button']").should("not.be.visible");
        cy.get("[data-testid='mobile-buttons']").should("not.be.visible");
    });

    it("shows only the mobile button drawer on mobile", () => {
        cy.viewport(360, 760);

        cy.get("[data-testid='desktop-buttons']").should("not.be.visible");
        cy.get("[data-testid='mobile-buttons']").should("not.be.visible");

        cy.get("button[aria-label='Mobile Menu Button']").click();

        cy.get("[data-testid='mobile-buttons']").should("be.visible");
        cy.get("[data-testid='mobile-buttons'] a[href='/parcels']")
            .contains("Parcels")
            .should("be.visible");
        cy.get("[data-testid='mobile-buttons'] a[href='/clients']")
            .contains("Clients")
            .should("be.visible");
        cy.get("[data-testid='mobile-buttons'] a[href='/lists']")
            .contains("Lists")
            .should("be.visible");
    });
});
