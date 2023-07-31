import { hexToRgb } from "@mui/material";

describe("Light and dark mode switch works", () => {
    beforeEach(() => {
        cy.login();
        cy.visit("/clients");
    });

    it("Switching to Dark Mode Works", () => {
        cy.get("label[aria-label='Theme Switch']").filter(":visible").click();
        cy.get("body").should("have.css", "background-color", hexToRgb("#1a1a1a"));
    });

    it("Switching back to Light Mode Works", () => {
        cy.get("label[aria-label='Theme Switch']").filter(":visible").click();
        cy.get("label[aria-label='Theme Switch']").filter(":visible").click();
        cy.get("body").should("have.css", "background-color", hexToRgb("#eeeeee"));
    });
});
