import React from "react";
import DataViewer, {
    DataViewerProps,
    convertDataToDataForDataViewer,
} from "@/components/DataViewer/DataViewer";
import StyleManager from "@/app/themes";

const longString = "abcdefghijklmnopqrstuvwxyz".repeat(20);
const longName = `John With A ${"Very ".repeat(20)}Long Name`;

const data = {
    id: longString,
    fullName: longName,
    phoneNumber: 1234567,
    dietaryRequirements: null,
};

const dataForDataViewer = convertDataToDataForDataViewer(data);

const StyledDataViewer: React.FC<DataViewerProps> = (props) => {
    return (
        <StyleManager>
            <DataViewer {...props} />
        </StyleManager>
    );
};

describe("Data Viewer Component", () => {
    it("renders", () => {
        cy.mount(<StyledDataViewer data={dataForDataViewer} />);
    });

    it("data viewer shows expected values", () => {
        cy.mount(<StyledDataViewer data={dataForDataViewer} />);

        cy.contains("ID");
        cy.contains(longString);
        cy.contains("FULL NAME");
        cy.contains(longName);
        cy.contains("PHONE NUMBER");
        cy.contains("1234567");
        cy.contains("DIETARY REQUIREMENTS");
    });
});
