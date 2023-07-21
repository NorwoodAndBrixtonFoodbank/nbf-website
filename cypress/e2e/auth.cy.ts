describe("Authentication tests", () => {
    it("Redirected to login page", () => {
        for (const url of ["/", "/clients", "/lists", "/calendar", "/login"]) {
            cy.visit(url);
            cy.url().should("include", "/login");
        }
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
