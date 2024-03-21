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

declare global {
    namespace Cypress {
        /* eslint-disable no-unused-vars */
        interface Chainable {
            login: () => void;
            checkAccessibility: (options?: object) => void;
        }

        /* eslint-enable no-unused-vars */
    }
}

const loginWithRetry = (iteration: number = 0): void => {
    if (iteration >= 4) {
        // This only ever seems to happen on GH Actions on the first test, so we can just log and move on
        // Redirects are tested by the auth spec
        cy.log("Login redirect failed");
        return;
    }

    cy.url().then((url) => {
        if (url.includes("login")) {
            cy.get("button[type='button']")
                .contains("Sign in")
                .then((submitButton) => {
                    if (submitButton.not(":disabled")) {
                        submitButton.trigger("click");
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

        cy.get("input[type='email']").type(email);
        cy.get("input[type='password']").type(password);

        cy.get("input[type='email']").should("have.value", email);
        cy.get("input[type='password']").should("have.value", password);

        loginWithRetry();
    });
    // If session cache is used, it only restores cookies/storage and NOT page!
    // Remember to cy.visit(url) as the first action after a login :)
});

Cypress.Commands.add("checkAccessibility", (options?) => {
    const terminalLog = (violations: Result[]): void => {
        cy.task(
            "log",
            violations.map(({ id, impact, description, nodes, helpUrl }) => ({
                id,
                impact,
                description,
                length: nodes.length,
                helpUrl,
                ...nodes.reduce(
                    (accumulator, node, index) => ({
                        ...accumulator,
                        [`node_${index}`]: node.html,
                    }),
                    {}
                ),
            }))
        );
    };

    cy.injectAxe();
    cy.checkA11y(undefined, options, terminalLog);
});

Cypress.on("uncaught:exception", (err) => {
    const str = err.toString();
    // NEXT_REDIRECT triggers when the client side router interrupts a cypress command
    // 419 is the same error but when minified in the production build
    if (str.includes("NEXT_REDIRECT") || str.includes("419")) {
        return false;
    }

    throw err;
});
