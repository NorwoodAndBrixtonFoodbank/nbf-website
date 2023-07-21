describe("Rendering tests", () => {
    beforeEach(() => {
        cy.login();
    });

    it("Renders clients page", () => {
        cy.visit("/clients");

        cy.get("h1").should("contain.text", "Clients Page");
    });

    it("Renders lists page", () => {
        cy.visit("/lists");

        cy.get("h1").should("contain.text", "Lists Page");
    });

    it("Renders calendar page", () => {
        cy.visit("/calendar");

        cy.get("h1").should("contain.text", "Calendar Page");
    });

    it("Renders add client page", () => {
        cy.visit("/add-clients");

        cy.get("h1").should("contain.text", "Client Form");
    });
});
