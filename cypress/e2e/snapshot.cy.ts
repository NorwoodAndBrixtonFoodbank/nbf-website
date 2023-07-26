import PAGES from "./PAGES";

describe("Screenshot tests", () => {
    PAGES.map((page) => {
        it(page.friendly_name, () => {
           cy.login();
           cy.visit(page.url);
           cy.compareSnapshot(page.friendly_name);
        });
    })
});
