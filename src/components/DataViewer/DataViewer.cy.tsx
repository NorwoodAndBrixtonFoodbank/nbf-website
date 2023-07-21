import React from "react";
import SampleDataViewerWithButton from "@/components/DataViewer/SampleDataViewerWithButton";

const longString = "abcdefghijklmnopqrstuvwxyz".repeat(20);

const longName = `John With A ${"Very ".repeat(20)}Long Name`;

const data = {
    id: longString,
    full_name: longName,
    phone_number: 1234567,
    dietary_requirements: null,
};

describe("<SampleDataViewerWithButton />", () => {
    it("renders", () => {
        cy.mount(<SampleDataViewerWithButton data={data} />);
    });

    it("data viewer shows expected values", () => {
        cy.mount(<SampleDataViewerWithButton data={data} />);

        cy.get("button").click();

        cy.contains("ID");
        cy.contains(longString);
        cy.contains("FULL NAME");
        cy.contains(longName);
        cy.contains("PHONE NUMBER");
        cy.contains("1234567");
        cy.contains("DIETARY REQUIREMENTS");
    });
});
