import PAGES from "../e2e_utils/PAGES";

describe("Authentication tests", () => {
    PAGES.map((page) => {
        if (page.friendly_name !== "Login") {
            it(`Redirected from ${page.friendly_name} to Login page`, () => {
                cy.visit(page.url);
                cy.url().should("include", "/login");
            });
        }
    });

    it("Get to Clients page", () => {
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
