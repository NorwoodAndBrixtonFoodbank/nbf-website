import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import CheckboxInput from "@/components/DataInput/CheckboxInput";
import { getCheckboxHandler } from "./inputHandlerFactories";

const mockIDLogger: (logId: string) => void = console.log;

describe("CheckboxInput component", () => {
    it("renders", () => {
        render(
            <CheckboxInput
                label="LABEL"
                onChange={getCheckboxHandler(
                    () => void mockIDLogger("DataInput component test: Checkbox Changed")
                )}
            />
        );
    });

    it("renders without optional props", () => {
        render(<CheckboxInput />);
    });

    it("propagates clicks as expected", () => {
        const mockOnChangeMethod = jest.fn();
        const unwrapChangeEvent = (event: React.ChangeEvent<HTMLInputElement>): void => {
            mockOnChangeMethod(event.target.checked);
        };

        render(<CheckboxInput label="A" onChange={unwrapChangeEvent} />);

        const checkbox = screen.getByRole("checkbox");
        fireEvent.click(checkbox);
        expect(mockOnChangeMethod).toHaveBeenCalledWith(true);

        fireEvent.click(checkbox);
        expect(mockOnChangeMethod).toHaveBeenCalledWith(false);
    });
});
