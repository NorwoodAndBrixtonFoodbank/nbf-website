import PAGES from "./PAGES";

describe("Screenshot tests", () => {
    PAGES.map((page) => {
        it(`${page.friendly_name} page`, () => {
           cy.login();
           cy.visit(page.url);
           cy.compareSnapshot(page.friendly_name, 0.05);
        });
    });

    it("Login page", () => {
        cy.visit("/login");
        cy.url().should("include", "/login");
        cy.compareSnapshot("Login", 0.05);
    })
});
