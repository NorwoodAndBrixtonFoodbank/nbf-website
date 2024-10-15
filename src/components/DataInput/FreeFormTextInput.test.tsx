import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { expect, it } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import FreeFormTextInput from "./FreeFormTextInput";
import { getFreeFormTextHandler } from "./inputHandlerFactories";
import userEvent from "@testing-library/user-event";

const mockIDLogger: (logId: string) => void = console.log;

describe("FreeFormTextInput component", () => {
    afterEach(() => {
        cleanup();
    });

    it("renders", () => {
        render(
            <FreeFormTextInput
                label="FreeForm"
                defaultValue="default"
                onChange={getFreeFormTextHandler(
                    () => void mockIDLogger("DataInput component test: Freeform Changed")
                )}
            />
        );
    });

    it("renders without optional props", () => {
        render(<FreeFormTextInput />);
    });

    it("displays the given error message", () => {
        render(<FreeFormTextInput label="FreeForm" error={true} helperText="Some error message" />);

        expect(screen.getByText("Some error message")).toBeVisible();
        expect(screen.getByText("Some error message")).toHaveClass("Mui-error");
    });

    it("handles changes as expected", async () => {
        const user = userEvent.setup();

        const onChangeMethod = jest.fn();
        const unwrappedChangeEvent = (event: React.ChangeEvent<HTMLInputElement>): void => {
            onChangeMethod(event.target.value);
        };

        render(<FreeFormTextInput label="FreeForm" onChange={unwrappedChangeEvent} />);

        const textInput = screen.getByLabelText("FreeForm");
        await user.type(textInput, "Test Text");

        expect(onChangeMethod).toHaveBeenCalledWith("Test Text");
    });
});
