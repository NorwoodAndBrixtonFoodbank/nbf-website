import PAGES from "../e2e_utils/PAGES";

describe("Authentication tests", () => {
    const email: string = Cypress.env("TEST_USER");
    const password: string = Cypress.env("TEST_PASS");

    const extendedTimeout = { timeout: 10000 };

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

    it("Redirected to clients after login", () => {
        cy.visit("/login");

        cy.get("[data-loaded='true']", extendedTimeout).should("exist");

        cy.get("input[type='email']").type(email);
        cy.get("input[type='password']").type(password);

        cy.get("input[type='email']").should("have.value", email);
        cy.get("input[type='password']").should("have.value", password);

        cy.get("button[type='submit']").click();

        cy.url(extendedTimeout).should("include", "/clients");
    });

    it("Sign out", () => {
        cy.login();
        cy.visit("/clients");
        cy.url().should("include", "/clients");
        cy.get("button[aria-label='Sign Out Button']").click();

        cy.url().should("include", "/login");
    });
});
