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

        cy.get("button[aria-label='Profile Settings']").eq(1).click();
        cy.get("li").contains("Sign Out").click({ force: true });

        cy.url().should("include", "/login");
    });
});
