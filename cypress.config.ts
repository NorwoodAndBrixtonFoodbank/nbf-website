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
                table(message: any[]): null {
                    if (message.length > 0) {
                        console.table(message);
                    }
                    return null;
                }
            });

            config.env = {
                TEST_USER: process.env.NEXT_PUBLIC_CYPRESS_TEST_USER!,
                TEST_PASS: process.env.NEXT_PUBLIC_CYPRESS_TEST_PASS!,
            };

            return config;
        },
        baseUrl: "http://localhost:3200",
        downloadsFolder: "cypress/downloads",
        video: false,
        videoUploadOnPasses: false,
        screenshotOnRunFailure: false,
    },

    component: {
        setupNodeEvents(on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) {
            on("task", {
                readPdf,
            });
            return config;
        },
        downloadsFolder: "cypress/downloads",
        devServer: {
            framework: "next",
            bundler: "webpack",
        },
        specPattern: "src/**/*.cy.{ts,tsx}",
    },
});
