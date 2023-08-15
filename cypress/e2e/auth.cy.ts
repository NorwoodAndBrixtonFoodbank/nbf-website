describe("Authentication tests", () => {
    const email: string = Cypress.env("TEST_USER");
    const password: string = Cypress.env("TEST_PASS");

    const extendedTimeout = { timeout: 10000 };

    const buttonReachablePaths = ["/", "/clients", "/lists", "/calendar"];
    const allPaths = [...buttonReachablePaths, "/clients/add"];

    it("Redirected to login page", () => {
        for (const url of allPaths) {
            cy.visit(url);
            cy.url().should("include", "/login");
        }
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

    it("Get to clients page", () => {
        cy.login();
        cy.visit("/clients");

        cy.url().should("include", "/clients");
    });

    it("Sign out", () => {
        cy.login();
        cy.visit("/clients");
        cy.url().should("include", "/clients");
        cy.get("button[aria-label='Sign Out Button']").click();

        cy.url().should("include", "/login");
    });
});
