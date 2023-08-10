describe("Authentication tests", () => {
    const email: string = Cypress.env("TEST_USER");
    const password: string = Cypress.env("TEST_PASS");

    const extendedTimeout = { timeout: 10000 };

    const paths = ["/", "/clients", "/clients/add", "/lists", "/calendar"];

    it("Redirected to login page", () => {
        for (const url of paths) {
            cy.visit(url);
            cy.url().should("include", "/login");
        }
    });

    it("Redirected to clients after login", () => {
        cy.visit("/login");

        cy.get("#login-panel[data-loaded='true']", extendedTimeout).should("exist");

        cy.get("input#email").type(email);
        cy.get("input#password").type(password);

        cy.get("#email").should("have.value", email);
        cy.get("#password").should("have.value", password);

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
        cy.get("button[aria-label='Sign Out Button']").click();

        cy.url().should("include", "/login");
    });

    it("CSR Redirected to login page", () => {
        cy.visit("/login");

        // wait for hydration
        cy.get("#login-panel[data-loaded='true']", extendedTimeout).should("exist");

        for (const url of paths) {
            cy.get("a[href='" + url + "']")
                .first()
                .click({ force: true });

            cy.url().should("include", "/login");
        }
    });
});
