import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
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
    afterEach(() => {
        cleanup();
    });

    it("renders", () => {
        render(
            <StyledModal
                header="Modal Header"
                headerId="testModal"
                isOpen={true}
                onClose={() => undefined}
            >
                <h1>Modal Content</h1>
            </StyledModal>
        );
    });

    it("modal can be opened", () => {
        render(
            <StyledModal
                header="Modal Header"
                headerId="testModal"
                isOpen={true}
                onClose={() => undefined}
            >
                <h1>Modal Content</h1>
            </StyledModal>
        );

        expect(screen.getByText("Modal Header")).toBeVisible();
        expect(screen.getByText("Modal Content")).toBeVisible();
    });

    it("modal can be closed", () => {
        render(
            <StyledModal
                header="Modal Header"
                headerId="testModal"
                isOpen={false}
                onClose={() => undefined}
            >
                <h1>Modal Content</h1>
            </StyledModal>
        );

        expect(screen.queryByText("Modal Header")).toBeNull();
        expect(screen.queryByText("Modal Content")).toBeNull();
    });

    it("modal close button works", () => {
        const onCloseSpy = jest.fn();

        render(
            <StyledModal
                header="Modal Header"
                headerId="testModal"
                isOpen={true}
                onClose={onCloseSpy}
            >
                <h1>Modal Content</h1>
            </StyledModal>
        );

        fireEvent.click(screen.getByLabelText("Close Button"));

        expect(onCloseSpy).toHaveBeenCalled();
    });
});
