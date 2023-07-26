import PAGES from "./PAGES";

describe("Accessibility tests", () => {
    ["light", "dark"].map((mode) => {
        describe(`${mode} mode`, () => {
            PAGES.map((page) => {
                it(`Checks ${page.friendly_name} page`, () => {
                    cy.login();
                    cy.visit(page.url);

                    cy.get(`.${mode}-button`).click();

                    cy.checkAccessibility();
                })
            });

            it("Checks login page", () => {
                cy.visit("/login");
                cy.url().should("include", "/login"); // verify not logged in

                cy.get(`.${mode}-button`).click();

                cy.checkAccessibility();
            });
        });
    });
});
