import PAGES from "../e2e_utils/PAGES";
import SCREEN_SIZES from "../e2e_utils/SCREEN_SIZES";

describe("Snapshot tests", () => {
    ["light", "dark"].map((mode) => {
        describe(`${mode} mode`, () => {
            SCREEN_SIZES.map((screen) => {
                describe(`${screen.name} page`, () => {
                    PAGES.map((page) => {
                        it(`${page.friendly_name} page`, () => {
                            cy.viewport(...screen.resolution);
                            if (page.requiresLogin) {
                                cy.login();
                            }
                            cy.visit(page.url);
                            page.waitForLoad();

                            cy.compareSnapshot(
                                `${page.friendly_name}_${screen.name}_${mode}`,
                                0.05
                            );
                        });
                    });
                });
            });
        });
    });
});
