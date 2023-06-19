import React from "react";
import ButtonPost from "./ButtonPost";

describe("<ButtonPost />", () => {
    it("renders", () => {
        cy.mount(<ButtonPost url="test_url" text="test_text" />);
    });

    it("text is correct", () => {
        cy.mount(<ButtonPost url="test_url" text="test_text" />);

        cy.get("input[type=submit]").should("have.value", "test_text");
    });

    it("sends a post request", () => {
        cy.mount(<ButtonPost url="test_url" text="test_text" />);

        cy.intercept("POST", "test_url").as("button_is_clicked");
        cy.get("input[type=submit]").click();

        cy.wait("@button_is_clicked");
    });
});
