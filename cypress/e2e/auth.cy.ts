import PAGES from "./PAGES";

describe("Authentication tests", () => {
    PAGES.map((page) => {
        it(`Redirected from ${page.friendly_name} to login page`, () => {
            cy.visit(page.url);
            cy.url().should("include", "/login");
        });
    });

    it("Get to clients page", () => {
        cy.login();
        cy.visit("/clients");

        cy.url().should("include", "/clients");
    });

    it("Sign out", () => {
        cy.login();

        cy.visit("/clients");
        cy.get("input[type=submit]").contains("Sign out").click();

        cy.url().should("include", "/login");
    });
});
