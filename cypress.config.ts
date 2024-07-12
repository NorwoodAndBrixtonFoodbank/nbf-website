import registerCodeCoverageTasks from "@cypress/code-coverage/task";
import { defineConfig } from "cypress";
import readPdf from "./cypress/support/readPdf";

import * as dotenv from "dotenv";

dotenv.config({ path: "./.env.local" });

export default defineConfig({
    e2e: {
        setupNodeEvents(on, config) {
            // implement node event listeners here
            registerCodeCoverageTasks(on, config);

            on("task", {
                log: (message: unknown): null => {
                    console.log(message);
                    return null;
                },
            });

            if (
                process.env.NEXT_PUBLIC_CYPRESS_TEST_USER === null ||
                process.env.NEXT_PUBLIC_CYPRESS_TEST_PASS === null
            ) {
                throw new Error(
                    "CYPRESS_TEST_USER and CYPRESS_TEST_PASS must be set in .env.local"
                );
            }

            config.env = {
                TEST_USER: process.env.NEXT_PUBLIC_CYPRESS_TEST_USER,
                TEST_PASS: process.env.NEXT_PUBLIC_CYPRESS_TEST_PASS,
            };

            return config;
        },
        baseUrl: "http://localhost:3200",
        video: true,
        screenshotOnRunFailure: true,
    },
    component: {
        setupNodeEvents(on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) {
            on("task", {
                readPdf,
            });
            return config;
        },
        devServer: {
            framework: "next",
            bundler: "webpack",
        },
        specPattern: "src/**/*.cy.{ts,tsx}",
        video: false,
        screenshotOnRunFailure: false,
    },
});
