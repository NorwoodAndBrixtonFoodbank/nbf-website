describe("Accessibility tests in light mode", () => {
    it("Checks clients page", () => {
        cy.login();
        cy.visit("/clients");

        cy.checkAccessibility();
    });

    it("Checks lists page", () => {
        cy.login();
        cy.visit("/lists");

        cy.checkAccessibility();
    });

    it("Checks calendar page", () => {
        cy.login();
        cy.visit("/calendar");
        cy.get("table").should("be.visible");

        cy.checkAccessibility();
    });

    it("Checks clients/add page", () => {
        cy.login();
        cy.visit("/clients/add");

        cy.checkAccessibility();
    });

    it("Checks login page", () => {
        cy.visit("/login");

        // wait for hydration
        cy.get("[data-loaded='true']", { timeout: 10000 }).should("exist");

        cy.checkAccessibility();
    });
});

describe("Accessibility tests in dark mode", () => {
    it("Checks clients page", () => {
        cy.login();
        cy.visit("/clients");
        cy.get("label[aria-label='Theme Switch']").click();

        cy.checkAccessibility();
    });

    it("Checks lists page", () => {
        cy.login();
        cy.visit("/lists");
        cy.get("label[aria-label='Theme Switch']").click();

        cy.checkAccessibility();
    });

    it("Checks calendar page", () => {
        cy.login();
        cy.visit("/calendar");
        cy.get("table").should("be.visible");
        cy.get("label[aria-label='Theme Switch']").click();

        cy.checkAccessibility();
    });

    it("Checks clients/add page", () => {
        cy.login();
        cy.visit("/clients/add");
        cy.get("label[aria-label='Theme Switch']").click();

        cy.checkAccessibility();
    });

    it("Checks login page", () => {
        cy.visit("/login");

        // wait for hydration
        cy.get("[data-loaded='true']", { timeout: 10000 }).should("exist");
        cy.get("label[aria-label='Theme Switch']").click();

        cy.checkAccessibility();
    });
});
