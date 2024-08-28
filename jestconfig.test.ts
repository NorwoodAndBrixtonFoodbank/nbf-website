import { expect, it } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
test("should load environment variable CLOUDWATCH_LOG_GROUP from .env.test", () => {
    expect(process.env.CLOUDWATCH_LOG_GROUP).toBe("Nonsense");
});

test("should load environment variable CLOUDWATCH_LOG_STREAM from .env.test", () => {
    expect(process.env.CLOUDWATCH_LOG_STREAM).toBe("Nonsense");
});

test("should load environment variable CLOUDWATCH_ACCESS_KEY from .env.test", () => {
    expect(process.env.CLOUDWATCH_ACCESS_KEY).toBe("Nonsense");
});

test("should load environment variable CLOUDWATCH_SECRET_ACCESS_KEY from .env.test", () => {
    expect(process.env.CLOUDWATCH_SECRET_ACCESS_KEY).toBe("Nonsense");
});
