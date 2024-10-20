import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import CheckboxGroupInput from "./CheckboxGroupInput";
import { getCheckboxGroupHandler } from "./inputHandlerFactories";

const mockIDLogger: (logId: string) => void = console.log;

describe("CheckboxGroupInput component", () => {
    afterEach(() => {
        cleanup();
    });

    it("renders", () => {
        render(
            <CheckboxGroupInput
                labelsAndKeys={[
                    ["Label A", "a"],
                    ["Label B", "b"],
                    ["Label C", "c"],
                ]}
                groupLabel="Checkbox Group"
                onChange={getCheckboxGroupHandler(
                    {},
                    () => void mockIDLogger("DataInput component test: Checkbox Group Changed")
                )}
            />
        );
    });

    it("renders without optional props", () => {
        render(
            <CheckboxGroupInput
                labelsAndKeys={[
                    ["Label A", "a"],
                    ["Label B", "b"],
                    ["Label C", "c"],
                ]}
            />
        );
    });

    it("behaves as expected when initialised without a checked keys list", () => {
        const mockOnChangeMethod = jest.fn();
        const unwrapEvent = (event: React.ChangeEvent<HTMLInputElement>): void => {
            mockOnChangeMethod(event.target.name, event.target.checked);
        };

        render(
            <CheckboxGroupInput
                labelsAndKeys={[
                    ["Label A", "a"],
                    ["Label B", "b"],
                    ["Label C", "c"],
                ]}
                groupLabel="Checkbox Group"
                onChange={unwrapEvent}
            />
        );

        const checkboxA = screen.getByTestId("option-a");
        fireEvent.click(checkboxA);
        expect(mockOnChangeMethod.mock.lastCall).toEqual(["a", true]);

        const checkboxB = screen.getByTestId("option-b");
        fireEvent.click(checkboxB);
        expect(mockOnChangeMethod.mock.lastCall).toEqual(["b", true]);

        const checkboxC = screen.getByTestId("option-c");
        fireEvent.click(checkboxC);
        expect(mockOnChangeMethod.mock.lastCall).toEqual(["c", true]);

        fireEvent.click(checkboxA);
        expect(mockOnChangeMethod.mock.lastCall).toEqual(["a", false]);
    });

    it("behaves as expected when controlled and initialised", () => {
        const mockOnChangeMethod = jest.fn();
        const unwrappedChangeEvent = (event: React.ChangeEvent<HTMLInputElement>): void => {
            mockOnChangeMethod(event.target.name, event.target.checked);
        };

        render(
            <CheckboxGroupInput
                labelsAndKeys={[
                    ["Label A", "a"],
                    ["Label B", "b"],
                    ["Label C", "c"],
                ]}
                groupLabel="Checkbox Group"
                onChange={unwrappedChangeEvent}
                checkedKeys={["a", "c"]}
            />
        );

        const checkboxA = screen.getByTestId("option-a");
        fireEvent.click(checkboxA);
        expect(mockOnChangeMethod.mock.lastCall).toEqual(["a", false]);

        const checkboxB = screen.getByTestId("option-b");
        fireEvent.click(checkboxB);
        expect(mockOnChangeMethod.mock.lastCall).toEqual(["b", true]);

        const checkboxC = screen.getByTestId("option-c");
        fireEvent.click(checkboxC);
        expect(mockOnChangeMethod.mock.lastCall).toEqual(["c", false]);
    });
});
