import React from "react";
import Modal, { ModalProps } from "@/components/Modal/Modal";
import StyleManager from "@/app/themes";

const StyledModal: React.FC<ModalProps> = (props) => {
    return (
        <StyleManager>
            <Modal {...props} />
        </StyleManager>
    );
};

describe("General Modal Component", () => {
    it("renders", () => {
        cy.mount(
            <StyledModal
                header="Modal Header"
                headerId="testModal"
                isOpen={true}
                onClose={() => {}}
            >
                <h1>Modal Content</h1>
            </StyledModal>
        );
    });

    it("modal can be opened", () => {
        cy.mount(
            <StyledModal
                header="Modal Header"
                headerId="testModal"
                isOpen={true}
                onClose={() => {}}
            >
                <h1>Modal Content</h1>
            </StyledModal>
        );

        cy.contains("Modal Header");
        cy.contains("Modal Content");
    });

    it("modal can be closed", () => {
        cy.mount(
            <StyledModal
                header="Modal Header"
                headerId="testModal"
                isOpen={false}
                onClose={() => {}}
            >
                <h1>Modal Content</h1>
            </StyledModal>
        );

        cy.contains("Modal Header").should("not.exist");
        cy.contains("Modal Content").should("not.exist");
    });

    it("modal close button works", () => {
        const onCloseSpy = cy.spy().as("onCloseSpy");

        cy.mount(
            <StyledModal
                header="Modal Header"
                headerId="testModal"
                isOpen={true}
                onClose={onCloseSpy}
            >
                <h1>Modal Content</h1>
            </StyledModal>
        );

        cy.get("svg").parent("button").click();
        cy.get("@onCloseSpy").should("have.been.calledOnce");
    });
});
