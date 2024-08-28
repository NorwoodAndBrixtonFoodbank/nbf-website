import type { Config } from "jest";
import tsconfig from "./tsconfig.json";

import { config as dotenvConfig } from 'dotenv';
dotenvConfig({ path: ".env.test" });

tsconfig.compilerOptions.jsx = "react";
tsconfig.compilerOptions.target = "esnext";

const config: Config = {
    moduleNameMapper: {
        "@/(.*)$": "<rootDir>/src/$1",
        "^jose": "jose",
    },
    moduleFileExtensions: ["js", "jsx", "tsx", "ts"],
    testEnvironment: "jsdom",
    setupFiles: ["./jest.setup.ts"],
    transform: {
        "^.+\\.(ts|tsx)?$": [
            "ts-jest",
            {
                tsconfig: tsconfig.compilerOptions,
            },
        ],
    },
    modulePaths: ["<rootDir>/src", "<rootDir>/node_modules"],
};

export default config;
