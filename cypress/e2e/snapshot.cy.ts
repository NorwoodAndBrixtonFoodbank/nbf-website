import PAGES from "../e2e_utils/PAGES";
import SCREEN_SIZES from "../e2e_utils/SCREEN_SIZES";

describe("Screenshot tests", () => {
    SCREEN_SIZES.map((screen) => {
        PAGES.map((page) => {
            it(`${page.friendly_name} ${screen.name} page`, () => {
                cy.viewport(...screen.resolution);
                if (page.requiresLogin) {
                    cy.login();
                }

                cy.visit(page.url);
                cy.compareSnapshot(`${page.friendly_name}_${screen.name}`, 0.05);
            });
        });
    });
});
