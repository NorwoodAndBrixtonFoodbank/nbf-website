import { hexToRgb } from "@mui/material";

describe("Light and dark mode buttons work", () => {
    it("Light mode button works", () => {
        cy.login();
        cy.get(".light-button").click();
        cy.get("body").should("have.css", "background-color", hexToRgb("#eeeeee"));
    });

    it("dark mode button works", () => {
        cy.login();
        cy.get(".dark-button").click();
        cy.get("body").should("have.css", "background-color", hexToRgb("#1a1a1a"));
    });
});
