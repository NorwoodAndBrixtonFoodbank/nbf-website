import React from "react";
import CheckboxInput from "@/components/DataInput/CheckboxInput";
import DropdownListInput from "@/components/DataInput/DropdownListInput";
import FreeFormTextInput from "@/components/DataInput/FreeFormTextInput";
import RadioGroupInput from "@/components/DataInput/RadioGroupInput";
import {
    getFreeFormTextHandler,
    getCheckboxHandler,
    getDropdownListHandler,
    getRadioGroupHandler,
} from "@/components/DataInput/inputHandlerFactories";

describe("Data Input Components", () => {
    it("renders", () => {
        cy.mount(
            <CheckboxInput
                label="LABEL"
                onChange={getCheckboxHandler(() => console.log("Checkbox Changed"))}
            />
        );
        cy.mount(
            <DropdownListInput
                labelsAndValues={[
                    ["A", "a"],
                    ["B", "b"],
                    ["C", "c"],
                ]}
                listTitle="Dropdown List"
                defaultValue="Default"
                onChange={getDropdownListHandler(() => console.log("Dropdown Changed"))}
            />
        );
        cy.mount(
            <FreeFormTextInput
                label="FreeForm"
                defaultValue="default"
                onChange={getFreeFormTextHandler(() => console.log("Freeform Changed"))}
            />
        );
        cy.mount(
            <RadioGroupInput
                labelsAndValues={[
                    ["A", "a"],
                    ["B", "b"],
                    ["C", "c"],
                ]}
                groupTitle="Radio Group"
                onChange={getRadioGroupHandler(() => console.log("Radio Changed"))}
            />
        );
    });

    it("renders without optional props", () => {
        cy.mount(
            <CheckboxInput onChange={getCheckboxHandler(() => console.log("Checkbox Changed"))} />
        );
        cy.mount(
            <DropdownListInput
                labelsAndValues={[
                    ["A", "a"],
                    ["B", "b"],
                    ["C", "c"],
                ]}
                onChange={getDropdownListHandler(() => console.log("Dropdown Changed"))}
            />
        );
        cy.mount(
            <FreeFormTextInput
                onChange={getFreeFormTextHandler(() => console.log("Freeform Changed"))}
            />
        );
        cy.mount(
            <RadioGroupInput
                labelsAndValues={[
                    ["A", "a"],
                    ["B", "b"],
                    ["C", "c"],
                ]}
                onChange={getRadioGroupHandler(() => console.log("Radio Changed"))}
            />
        );
    });

    describe("Change Handlers", () => {
        it("Change handler for checkbox works", () => {
            const onChangeSpy = cy.spy().as("onChangeSpy");
            const unwrapEvent = (e: any): void => {
                onChangeSpy(e.target.checked);
            };

            cy.mount(<CheckboxInput label="A" onChange={unwrapEvent} />);

            cy.get("input").click();
            cy.get("@onChangeSpy").should("have.been.calledWith", true);

            cy.get("input").click();
            cy.get("@onChangeSpy").should("have.been.calledWith", false);
        });

        it("Change handler for dropdown works", () => {
            const onChangeSpy = cy.spy().as("onChangeSpy");
            const unwrapEvent = (e: any): void => {
                onChangeSpy(e.target.value);
            };

            cy.mount(
                <DropdownListInput
                    labelsAndValues={[
                        ["A", "a"],
                        ["B", "b"],
                        ["C", "c"],
                    ]}
                    listTitle="Dropdown List"
                    defaultValue="Default"
                    onChange={unwrapEvent}
                />
            );

            cy.get("div[class^='MuiSelect'").click();

            cy.get("li[data-value='a']").click();
            cy.get("@onChangeSpy").should("have.been.calledWith", "a");

            cy.get("li[data-value='b']").click();
            cy.get("@onChangeSpy").should("have.been.calledWith", "b");

            cy.get("li[data-value='c']").click();
            cy.get("@onChangeSpy").should("have.been.calledWith", "c");
        });

        it("Change handler for freeform text works", () => {
            const onChangeSpy = cy.spy().as("onChangeSpy");
            const unwrapEvent = (e: any): void => {
                onChangeSpy(e.target.value);
            };

            cy.mount(<FreeFormTextInput label="FreeForm" onChange={unwrapEvent} />);

            cy.get("input[class^='MuiInputBase']").type("TEST_TEXT");
            cy.get("@onChangeSpy").should("have.been.calledWith", "TEST_TEXT");
        });

        it("Change handler for radio group works", () => {
            const onChangeSpy = cy.spy().as("onChangeSpy");
            const unwrapEvent = (e: any): void => {
                onChangeSpy(e.target.value);
            };

            cy.mount(
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

            cy.get("input[value='a']").click();
            cy.get("@onChangeSpy").should("have.been.calledWith", "a");

            cy.get("input[value='b']").click();
            cy.get("@onChangeSpy").should("have.been.calledWith", "b");

            cy.get("input[value='c']").click();
            cy.get("@onChangeSpy").should("have.been.calledWith", "c");
        });
    });
});
