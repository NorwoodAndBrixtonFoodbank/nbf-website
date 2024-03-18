describe("Accessibility tests in light mode", () => {
    it("Checks clients page", () => {
        cy.login();
        cy.visit("/clients");

        cy.checkAccessibility();
    });

    it("Checks clients/add page", () => {
        cy.login();
        cy.visit("/clients/add");

        cy.checkAccessibility();
    });

    it("Checks parcels page", () => {
        cy.login();
        cy.visit("/parcels");

        cy.checkAccessibility();
    });

    it("Checks parcels/add/[id] page", () => {
        cy.login();
        cy.visit("/parcels/add/1");

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

    it("Checks admin page", () => {
        cy.login();
        cy.visit("/admin");
        cy.get("h1").should("exist");

        cy.checkAccessibility({
            // TODO Fix duplicate IDs issue in Table component (react-data-table-component)
            rules: {
                "duplicate-id": { enabled: false },
            },
        });
    });

    it("Checks login page", () => {
        cy.visit("/login");

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

    it("Checks clients/add page", () => {
        cy.login();
        cy.visit("/clients/add");
        cy.get("label[aria-label='Theme Switch']").click();

        cy.checkAccessibility();
    });

    it("Checks parcels page", () => {
        cy.login();
        cy.visit("/parcels");
        cy.get("label[aria-label='Theme Switch']").click();

        cy.checkAccessibility();
    });

    it("Checks parcels/add/[id] page", () => {
        cy.login();
        cy.visit("/parcels/add/1");
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
        cy.get("label[aria-label='Theme Switch']").click();
        cy.get("table").should("be.visible");

        cy.checkAccessibility();
    });

    it("Checks admin page", () => {
        cy.login();
        cy.visit("/admin");
        cy.get("h1").should("exist");
        cy.get("label[aria-label='Theme Switch']").click();

        cy.checkAccessibility({
            // TODO Fix duplicate IDs issue in Table component (react-data-table-component)
            rules: {
                "duplicate-id": { enabled: false },
            },
        });
    });

    it("Checks login page", () => {
        cy.visit("/login");

        cy.get("label[aria-label='Theme Switch']").click();

        cy.checkAccessibility();
    });
});
