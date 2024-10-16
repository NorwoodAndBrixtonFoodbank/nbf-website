import type { Config } from "jest";
import tsconfig from "./tsconfig.json";

const jestTsConfig = {
    ...tsconfig.compilerOptions,
    jsx: "react",
    target: "esnext",
};

const config: Config = {
    moduleNameMapper: {
        "@/(.*)$": "<rootDir>/src/$1",
        "^jose": "jose",
    },
    moduleFileExtensions: ["js", "jsx", "tsx", "ts"],
    testEnvironment: "jsdom",
    testEnvironmentOptions: {
        customExportConditions: [], // workaround for fullcalendar: https://fullcalendar.io/docs/react#jest
    },
    setupFiles: ["./jest.setup.ts"],
    transform: {
        "^.+\\.(ts|tsx)?$": [
            "ts-jest",
            {
                tsconfig: jestTsConfig,
            },
        ],
        "^.+\\.svg$": "jest-transformer-svg",
    },
    modulePaths: ["<rootDir>/src", "<rootDir>/node_modules"],
};

export default config;
