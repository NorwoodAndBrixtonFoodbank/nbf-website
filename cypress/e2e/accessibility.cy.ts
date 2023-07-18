describe("Accessibility tests in light mode", () => {
    beforeEach(() => {
        cy.login();
        cy.get(".light-button").click();
    });

    it("Checks clients page", () => {
        cy.visit("/clients");

        cy.checkAccessibility();
    });

    it("Checks lists page", () => {
        cy.visit("/lists");

        cy.checkAccessibility();
    });

    it("Checks calendar page", () => {
        cy.visit("/calendar");

        cy.checkAccessibility();
    });

    it("Checks login page", () => {
        cy.get("input[type=submit]").contains("Sign out").click();
        cy.url().should("include", "/login");

        cy.checkAccessibility();
    });
});

describe("Accessibility tests in dark mode", () => {
    beforeEach(() => {
        cy.login();
        cy.get(".dark-button").click();
    });

    it("Checks clients page", () => {
        cy.visit("/clients");

        cy.checkAccessibility();
    });

    it("Checks lists page", () => {
        cy.visit("/lists");

        cy.checkAccessibility();
    });

    it("Checks calendar page", () => {
        cy.visit("/calendar");

        cy.checkAccessibility();
    });

    it("Checks login page", () => {
        cy.get("input[type=submit]").contains("Sign out").click();
        cy.url().should("include", "/login");

        cy.checkAccessibility();
    });
});
