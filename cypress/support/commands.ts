/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//

import { Result } from "axe-core";

Cypress.Commands.add("login", () => {
    const email = Cypress.env("TEST_USER");
    const password = Cypress.env("TEST_PASS");

    cy.session(email, () => {
        cy.intercept("http://localhost:3000/auth/callback").as("auth");

        cy.visit("/");
        cy.url().should("include", "/login");

        cy.get("input#email").type(email);
        cy.get("input#password").type(password);
        cy.get("button[type=submit]").as("login_button").click();
        cy.get("@login_button").should("be.enabled");
    });

    cy.visit("/clients"); // if session cache is used, then it doesn't redirect - so redirect manually!

    cy.url().should("include", "/clients");
});

Cypress.Commands.add("checkAccessibility", () => {
    const terminalLog = (violations: Result[]): void => {
        cy.task("table",
            violations.map(({ id, impact, description, nodes }) => ({
                id,
                impact,
                description,
                length: nodes.length,
            }))
        );
    };

    cy.injectAxe();
    cy.checkA11y(undefined, undefined, terminalLog);
});
