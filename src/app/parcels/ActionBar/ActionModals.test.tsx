import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { expect, it } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import GeneralActionModal from "@/app/parcels/ActionBar/ActionModals/GeneralActionModal";
import StyleManager from "@/app/themes";
import Localization from "@/app/Localization";

const mockOnClose: jest.Mock = jest.fn();
const mockOnSubmit: jest.Mock = jest.fn();

describe("Actions", () => {
    beforeEach(() => {
        cleanup();
        render(
            <Localization>
                <StyleManager>
                    <GeneralActionModal
                        onClose={mockOnClose}
                        errorMessage={null}
                        successMessage={null}
                        header="TestModal"
                        isOpen={true}
                        headerId="test-modal-header"
                    >
                        <p> Test Content </p>
                        <button data-testid="action-button" onClick={mockOnSubmit}>
                            Download Shopping List
                        </button>
                    </GeneralActionModal>
                </StyleManager>
            </Localization>
        );
    });

    it("should render the modal with the action button and content above the button", () => {
        expect(screen.getByTestId("action-button")).toBeInTheDocument();
        expect(screen.getByText("Test Content")).toBeInTheDocument();
    });

    it("should call the onClose function when the close button is clicked", () => {
        fireEvent.click(screen.getByLabelText("Close Button"));
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("should call the onSubmit function when the action button is clicked", () => {
        fireEvent.click(screen.getByTestId("action-button"));
        expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });

    it("should not render the modal when isOpen is false", () => {
        cleanup();
        render(
            <GeneralActionModal
                onClose={mockOnClose}
                errorMessage={null}
                successMessage={null}
                header="TestModal"
                isOpen={false}
                headerId="test-modal-header"
            >
                <p> Test Content </p>
                <button data-testid="action-button" onClick={mockOnSubmit}>
                    Download Shopping List
                </button>
            </GeneralActionModal>
        );
        expect(screen.queryByText("Test Content")).not.toBeInTheDocument();
    });
});
