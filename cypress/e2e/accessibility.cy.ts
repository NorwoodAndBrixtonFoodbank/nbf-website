describe("Accessibility tests in light mode", () => {
    beforeEach(() => {
        cy.login();
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
        cy.get("table").should("be.visible");

        cy.checkAccessibility();
    });

    it("Checks login page", () => {
        cy.visit("/clients");
        cy.get("button[aria-label='Sign Out Button']").filter(":visible").click();
        cy.url().should("include", "/login");

        cy.checkAccessibility();
    });
});

describe("Accessibility tests in dark mode", () => {
    beforeEach(() => {
        cy.login();
    });

    it("Checks clients page", () => {
        cy.visit("/clients");
        cy.get("label[aria-label='Theme Switch']").filter(":visible").click();

        cy.checkAccessibility();
    });

    it("Checks lists page", () => {
        cy.visit("/lists");
        cy.get("label[aria-label='Theme Switch']").filter(":visible").click();

        cy.checkAccessibility();
    });

    it("Checks calendar page", () => {
        cy.visit("/calendar");
        cy.get("table").should("be.visible");
        cy.get("label[aria-label='Theme Switch']").filter(":visible").click();

        cy.checkAccessibility();
    });

    it("Checks login page", () => {
        cy.visit("/clients");
        cy.get("label[aria-label='Theme Switch']").filter(":visible").click();
        cy.get("button[aria-label='Sign Out Button']").filter(":visible").click();
        cy.url().should("include", "/login");

        cy.checkAccessibility();
    });
});
