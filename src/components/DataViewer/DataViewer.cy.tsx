import React from "react";
import DataViewerWithButton from "@/components/DataViewer/SampleDataViewerWithButton";

const longString = "abcdefghijklmnopqrstuvwxyz".repeat(20);

const longName = `John With A ${"Very ".repeat(20)}Long Name`;

const data = {
    id: longString,
    full_name: longName,
    phone_number: 1234567,
    dietary_requirements: null,
};

describe("<DataViewerWithButton />", () => {
    it("renders", () => {
        cy.mount(<DataViewerWithButton data={data} />);
    });

    it("modal can be opened", () => {
        cy.mount(<DataViewerWithButton data={data} />);

        cy.get("button").click();

        cy.contains("FULL NAME");
    });

    it("modal can be closed", () => {
        cy.mount(<DataViewerWithButton data={data} />);

        cy.get("button").click();

        cy.get("button").children("svg").click();

        cy.get("body").should("not.have.value", "FULL NAME");
    });

    it("modal shows expected values", () => {
        cy.mount(<DataViewerWithButton data={data} />);

        cy.get("button").click();

        cy.contains(longString);
        cy.contains(longName);
        cy.contains("1234567");

        cy.contains("DIETARY REQUIREMENTS");
    });
});
