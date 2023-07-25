import React from "react";
import Modal from "@/components/Modal/Modal";

describe("General Modal Component", () => {
    it("renders", () => {
        cy.mount(
            <Modal header="Modal Header" ariaLabel="Modal Label" isOpen={true} onClose={() => {}}>
                <h1>Modal Content</h1>
            </Modal>
        );
    });

    it("modal can be opened", () => {
        cy.mount(
            <Modal header="Modal Header" isOpen={true} onClose={() => {}}>
                <h1>Modal Content</h1>
            </Modal>
        );

        cy.contains("Modal Header");
        cy.contains("Modal Content");
    });

    it("modal can be closed", () => {
        cy.mount(
            <Modal header="Modal Header" isOpen={false} onClose={() => {}}>
                <h1>Modal Content</h1>
            </Modal>
        );

        cy.contains("Modal Header").should("not.exist");
        cy.contains("Modal Content").should("not.exist");
    });

    it("modal close button works", () => {
        const onCloseSpy = cy.spy().as("onCloseSpy");

        cy.mount(
            <Modal header="Modal Header" isOpen={true} onClose={onCloseSpy}>
                <h1>Modal Content</h1>
            </Modal>
        );

        cy.get("svg").parent("button").click();
        cy.get("@onCloseSpy").should("have.been.calledOnce");
    });
});
