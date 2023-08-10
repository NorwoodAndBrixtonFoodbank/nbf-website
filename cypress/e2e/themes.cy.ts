import { hexToRgb } from "@mui/material";

describe("Light and dark mode switch works", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("Switching to Dark Mode Works", () => {
        cy.get("label[aria-label='Theme Switch']").click();
        cy.get("body").should("have.css", "background-color", hexToRgb("#2d2d2d"));
    });

    it("Switching back to Light Mode Works", () => {
        cy.get("label[aria-label='Theme Switch']").click();
        cy.get("label[aria-label='Theme Switch']").click();
        cy.get("body").should("have.css", "background-color", hexToRgb("#eeeeee"));
    });
});
