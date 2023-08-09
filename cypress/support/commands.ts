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
import "@cypress/code-coverage/support";
import "cypress-axe";

const loginWithRetry = (iteration: number = 0): void => {
    if (iteration >= 5) {
        // This only ever seems to happen on GH Actions on the first test, so we can just log and move on
        // Redirects are tested by the auth spec
        cy.log("Login redirect failed");
        return;
    }

    cy.get("h1").then(($h1) => {
        if ($h1.text().includes("Login")) {
            cy.get("button[type='submit']").then(($el) => {
                if ($el.not(":disabled")) {
                    $el.trigger("click");
                }
            });
            cy.wait(Math.pow(2, iteration) * 500);
            loginWithRetry(iteration + 1);
        }
    });
};

Cypress.Commands.add("login", () => {
    const email: string = Cypress.env("TEST_USER");
    const password: string = Cypress.env("TEST_PASS");

    cy.session(email, () => {
        cy.visit("/");

        // wait for hydration
        cy.get("#login-panel[data-loaded='true']", { timeout: 10000 }).should("exist");

        cy.get("input#email").type(email);
        cy.get("input#password").type(password);

        cy.get("#email").should("have.value", email);
        cy.get("#password").should("have.value", password);

        loginWithRetry();
    });
    // If session cache is used, it only restores cookies/storage and NOT page!
    // Remember to cy.visit(url) as the first action after a login :)
});

Cypress.Commands.add("checkAccessibility", () => {
    const terminalLog = (violations: Result[]): void => {
        cy.task(
            "table",
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

Cypress.on("uncaught:exception", (err) => {
    if (err.toString().includes("NEXT_REDIRECT")) {
        return false;
    }

    throw err;
});
