import React from "react";
import CheckboxInput from "@/components/DataInput/CheckboxInput";
import DropdownListInput from "@/components/DataInput/DropdownListInput";
import FreeFormTextInput from "@/components/DataInput/FreeFormTextInput";
import RadioGroupInput from "@/components/DataInput/RadioGroupInput";
import { handleChangeFactory } from "@/components/DataInput/changeHandlerFactories";

describe("Data Input Components", () => {
    it("renders", () => {
        cy.mount(
            <CheckboxInput
                optionLabels={["A", "B", "C"]}
                optionKeys={["a", "b", "c"]}
                groupLabel={"Check Group"}
                onChange={handleChangeFactory(() => console.log("Checkbox Changed"))}
            />
        );
        cy.mount(
            <DropdownListInput
                optionLabels={["A", "B", "C"]}
                optionValues={["a", "b", "c"]}
                listLabel={"Dropdown List"}
                defaultValue={"Default"}
                onChange={handleChangeFactory(() => console.log("Dropdown Changed"))}
            />
        );
        cy.mount(
            <FreeFormTextInput
                label={"FreeForm"}
                defaultValue={"default"}
                onChange={handleChangeFactory(() => console.log("Freeform Changed"))}
            />
        );
        cy.mount(
            <RadioGroupInput
                optionLabels={["A", "B", "C"]}
                optionValues={["a", "b", "c"]}
                groupLabel={"Radio Group"}
                onChange={handleChangeFactory(() => console.log("Radio Changed"))}
            />
        );
    });

    it("renders without optional props", () => {
        cy.mount(
            <CheckboxInput
                optionLabels={["A", "B", "C"]}
                optionKeys={["a", "b", "c"]}
                onChange={handleChangeFactory(() => console.log("Checkbox Changed"))}
            />
        );
        cy.mount(
            <DropdownListInput
                optionLabels={["A", "B", "C"]}
                optionValues={["a", "b", "c"]}
                onChange={handleChangeFactory(() => console.log("Dropdown Changed"))}
            />
        );
        cy.mount(
            <FreeFormTextInput
                onChange={handleChangeFactory(() => console.log("Freeform Changed"))}
            />
        );
        cy.mount(
            <RadioGroupInput
                optionLabels={["A", "B", "C"]}
                optionValues={["a", "b", "c"]}
                onChange={handleChangeFactory(() => console.log("Radio Changed"))}
            />
        );
    });

    describe("Change Handlers", () => {
        it("Change handler for checkbox works", () => {
            const onChangeSpy = cy.spy().as("onChangeSpy");
            const unwrapEvent = (e: any): void => {
                onChangeSpy(e.target.checked);
            };

            cy.mount(
                <CheckboxInput
                    optionLabels={["A", "B", "C"]}
                    optionKeys={["a", "b", "c"]}
                    groupLabel={"Check Group"}
                    onChange={unwrapEvent}
                />
            );

            cy.get("input[name='a']").click();
            cy.get("@onChangeSpy").should("have.been.calledWith", true);

            cy.get("input[name='a']").click();
            cy.get("@onChangeSpy").should("have.been.calledWith", false);

            cy.get("input[name='c']").click();
            cy.get("@onChangeSpy").should("have.been.calledWith", true);
        });

        it("Change handler for dropdown works", () => {
            const onChangeSpy = cy.spy().as("onChangeSpy");
            const unwrapEvent = (e: any): void => {
                onChangeSpy(e.target.value);
            };

            cy.mount(
                <DropdownListInput
                    optionLabels={["A", "B", "C"]}
                    optionValues={["a", "b", "c"]}
                    listLabel={"Dropdown List"}
                    defaultValue={"Default"}
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

            cy.mount(<FreeFormTextInput label={"FreeForm"} onChange={unwrapEvent} />);

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
                    optionLabels={["A", "B", "C"]}
                    optionValues={["a", "b", "c"]}
                    groupLabel={"Radio Group"}
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
