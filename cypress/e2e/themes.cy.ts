import { hexToRgb } from "@mui/material";

describe("Light and dark mode switch works", () => {
    beforeEach(() => {
        cy.visit("/login");

        // wait for hydration
        cy.get("[data-loaded='true']", { timeout: 10000 }).should("exist");
    });

    it("Switching to Dark Mode Works", () => {
        cy.get("[type='checkbox']").first().check();
        cy.get("body").should("have.css", "background-color", hexToRgb("#212121"));
    });

    it("Switching back to Light Mode Works", () => {
        cy.get("[type='checkbox']").first().uncheck();
        cy.get("body").should("have.css", "background-color", hexToRgb("#eeeeee"));
    });
});
