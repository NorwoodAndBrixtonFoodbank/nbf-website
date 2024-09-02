import { TextDecoder, TextEncoder } from "node:util";
import { config } from "dotenv";

config({ path: ".env.test" });

Object.defineProperties(globalThis, {
    TextDecoder: { value: TextDecoder },
    TextEncoder: { value: TextEncoder },
});

Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});
