import { defineConfig } from "cypress";
import registerCodeCoverageTasks from "@cypress/code-coverage/task";

import * as dotenv from "dotenv";
dotenv.config({path: "./.env.local"});

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      registerCodeCoverageTasks(on, config);

      config.env = {
        "TEST_USER": process.env.NEXT_PUBLIC_CYPRESS_TEST_USER!,
        "TEST_PASS": process.env.NEXT_PUBLIC_CYPRESS_TEST_PASS!,
      }

      return config;
    },
    baseUrl: "http://localhost:3000",
  },

  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
    "specPattern": "src/**/*.cy.{ts,tsx}",
  },
});
