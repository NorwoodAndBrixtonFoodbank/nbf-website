import React from "react";
import DataViewer from "@/components/DataViewer/DataViewer";

const longString = "abcdefghijklmnopqrstuvwxyz".repeat(20);
const longName = `John With A ${"Very ".repeat(20)}Long Name`;

const data = {
    id: longString,
    full_name: longName,
    phone_number: 1234567,
    dietary_requirements: null,
};

describe("Data Viewer Component", () => {
    it("renders", () => {
        cy.mount(
            <DataViewer
                data={data}
                header="Header"
                isOpen={true}
                onRequestClose={() => {}}
                ariaLabelledBy="dataViewer"
            />
        );
    });

    it("data viewer shows expected values", () => {
        cy.mount(
            <DataViewer
                data={data}
                header="Header"
                isOpen={true}
                onRequestClose={() => {}}
                ariaLabelledBy="dataViewer"
            />
        );

        cy.contains("ID");
        cy.contains(longString);
        cy.contains("FULL NAME");
        cy.contains(longName);
        cy.contains("PHONE NUMBER");
        cy.contains("1234567");
        cy.contains("DIETARY REQUIREMENTS");
    });
});
