import React from "react";
import SampleModalWithButton, {
    longString,
    longName,
} from "@/components/Modal/SampleModalWithButton";

describe("<SampleDataViewerWithButton />", () => {
    it("renders", () => {
        cy.mount(<SampleModalWithButton />);
    });

    it("modal can be opened", () => {
        cy.mount(<SampleModalWithButton />);

        cy.get("button").click();

        cy.contains("John");
    });

    it("modal can be closed", () => {
        cy.mount(<SampleModalWithButton />);

        cy.get("button").click();

        cy.get("button").children("svg").click();

        cy.get("body").should("not.have.value", "John");
    });

    it("modal shows expected values", () => {
        cy.mount(<SampleModalWithButton />);

        cy.wait(2000);

        cy.get("button").click();

        cy.contains(longString);
        cy.contains(longName);
    });
});
