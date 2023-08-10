import React from "react";
import DataViewer, { DataViewerProps } from "@/components/DataViewer/DataViewer";
import StyleManager from "@/app/themes";

const longString = "abcdefghijklmnopqrstuvwxyz".repeat(20);
const longName = `John With A ${"Very ".repeat(20)}Long Name`;

const data = {
    id: longString,
    full_name: longName,
    phone_number: 1234567,
    dietary_requirements: null,
};

const StyledDataViewer: React.FC<DataViewerProps> = (props) => {
    return (
        <StyleManager>
            <DataViewer {...props} />
        </StyleManager>
    );
};

describe("Data Viewer Component", () => {
    it("renders", () => {
        cy.mount(
            <StyledDataViewer
                data={data}
                header="Header"
                isOpen={true}
                onRequestClose={() => {}}
                headerId="dataViewer"
            />
        );
    });

    it("data viewer shows expected values", () => {
        cy.mount(
            <StyledDataViewer
                data={data}
                header="Header"
                isOpen={true}
                onRequestClose={() => {}}
                headerId="dataViewer"
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
