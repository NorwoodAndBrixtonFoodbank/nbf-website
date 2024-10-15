import React from "react";
import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, expect, it } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { UncontrolledSelect } from "./DropDownSelect";
import { getDropdownListHandler } from "./inputHandlerFactories";
import { SelectChangeEvent } from "@mui/material";
import userEvent from "@testing-library/user-event";

const mockIDLogger: (logId: string) => void = console.log;

describe("DropDownSelect component", () => {
    afterEach(() => {
        cleanup();
    });

    it("renders UncontrolledSelect", () => {
        render(
            <UncontrolledSelect
                selectLabelId="select-label"
                labelsAndValues={[
                    ["A", "a"],
                    ["B", "b"],
                    ["C", "c"],
                ]}
                listTitle="Dropdown List"
                defaultValue="b"
                onChange={getDropdownListHandler(
                    () => void mockIDLogger("DataInput component test: Dropdown Changed"),
                    (value: string): value is string => true
                )}
            />
        );
    });

    it("renders UncontrolledSelect without optional props", () => {
        render(
            <UncontrolledSelect
                selectLabelId="select-label"
                labelsAndValues={[
                    ["A", "a"],
                    ["B", "b"],
                    ["C", "c"],
                ]}
            />
        );
    });

    it.skip("handles changes in UncontrolledSelect as expected", async () => {
        // skipping because Mui isn't behaving as expected under Jest - doesn't call change
        // method & leaves popup on screen
        userEvent.setup();

        const mockOnChangeMethod = jest.fn();
        const unwrapEvent = (event: SelectChangeEvent): void => {
            console.log("Here: " + event.target.value);
            mockOnChangeMethod(event.target.value);
        };

        render(
            <UncontrolledSelect
                selectLabelId="my-select-label"
                labelsAndValues={[
                    ["A", "a"],
                    ["B", "b"],
                    ["C", "c"],
                ]}
                listTitle="My Dropdown List"
                defaultValue="b"
                onChange={unwrapEvent}
            />
        );

        // Material UI select is constructed from divs and a popup listbox
        userEvent.click(screen.getByLabelText("My Dropdown List"));
        let optionsPopupElement = await screen.findByRole("listbox", {
            name: "My Dropdown List",
        });
        userEvent.click(within(optionsPopupElement).getByRole("option", { name: "A" }));
        expect(mockOnChangeMethod).toHaveBeenCalledWith("a");

        userEvent.click(screen.getByLabelText("My Dropdown List"));
        optionsPopupElement = await screen.findByRole("listbox", {
            name: "My Dropdown List",
        });
        userEvent.click(within(optionsPopupElement).getByText("C"));
        expect(mockOnChangeMethod.mock.lastCall).toEqual(["c"]);

        userEvent.click(screen.getByLabelText("My Dropdown List"));
        optionsPopupElement = await screen.findByRole("listbox", {
            name: "My Dropdown List",
        });
        userEvent.click(within(optionsPopupElement).getByText("B"));
        expect(mockOnChangeMethod.mock.lastCall).toEqual(["b"]);
    });
});
