import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { expect, it } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import RadioGroupInput from "./RadioGroupInput";
import { getRadioGroupHandler } from "./inputHandlerFactories";

const mockIDLogger: (logId: string) => void = console.log;

describe("RadioGroupInput component", () => {
    afterEach(() => {
        cleanup();
    });

    it("renders", () => {
        render(
            <RadioGroupInput
                labelsAndValues={[
                    ["A", "a"],
                    ["B", "b"],
                    ["C", "c"],
                ]}
                groupTitle="Radio Group"
                onChange={getRadioGroupHandler(
                    () => void mockIDLogger("DataInput component test: Radio Changed")
                )}
            />
        );
    });

    it("renders without optional props", () => {
        render(
            <RadioGroupInput
                labelsAndValues={[
                    ["A", "a"],
                    ["B", "b"],
                    ["C", "c"],
                ]}
            />
        );
    });

    it("handles changes as expected", () => {
        const mockOnChangeMethod = jest.fn();
        const unwrapEvent = (event: React.ChangeEvent<HTMLInputElement>): void => {
            mockOnChangeMethod(event.target.value, event.target.checked);
        };

        render(
            <RadioGroupInput
                labelsAndValues={[
                    ["A", "a"],
                    ["B", "b"],
                    ["C", "c"],
                ]}
                groupTitle="Radio Group"
                onChange={unwrapEvent}
            />
        );

        const radioA = screen.getByTestId("option-a");
        fireEvent.click(radioA);
        expect(mockOnChangeMethod.mock.lastCall).toEqual(["a", true]);

        const radioC = screen.getByTestId("option-c");
        fireEvent.click(radioC);
        expect(mockOnChangeMethod.mock.lastCall).toEqual(["c", true]);

        const radioB = screen.getByTestId("option-b");
        fireEvent.click(radioB);
        expect(mockOnChangeMethod.mock.lastCall).toEqual(["b", true]);
    });
});
