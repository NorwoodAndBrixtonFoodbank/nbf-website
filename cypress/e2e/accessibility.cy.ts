import PAGES from "../e2e_utils/PAGES";
import SCREEN_SIZES from "../e2e_utils/SCREEN_SIZES";

describe("Accessibility tests", () => {
    ["light", "dark"].map((mode) => {
        describe(`${mode} mode`, () => {
            SCREEN_SIZES.map((screen) => {
                PAGES.map((page) => {
                    it(`Checks ${page.friendly_name} ${screen.resolution} page`, () => {
                        cy.viewport(...screen.resolution);
                        if (page.requiresLogin) {
                            cy.login();
                        }

                        cy.visit(page.url);
                        cy.get(`.${mode}-button`).click();

                        cy.checkAccessibility();
                    });
                });
            });
        });
    });
});
