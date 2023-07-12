import React from "react";
import DataViewerWithButton from "./DataViewerWithButton";

const data = {
    id: "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz",
    full_name:
        "John With A Very Very Very Very Very Very Very Very Very Very Very Very Very Long Name",
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

        cy.get("button").contains("X").click();

        cy.get("body").should("not.have.value", "FULL NAME");
    });
});
