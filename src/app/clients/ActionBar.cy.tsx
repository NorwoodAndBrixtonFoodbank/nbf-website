import { Schema } from "@/supabase";
import ActionBar from "@/app/clients/ActionBar";
import React from "react";
import StyleManager from "../themes";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/en-gb";

describe("Clients - Action Bar", () => {
    const mockData: Schema["parcels"][] = [
        {
            primary_key: "1",
            client_id: "1",
            collection_centre: "Clapham",
            collection_datetime: null,
            voucher_number: null,
            packing_datetime: null,
        },
    ];

    const selectedIndices = [0];

    const Component: React.FC<{}> = () => {
        return (
            <LocalizationProvider adapterLocale="en-gb" dateAdapter={AdapterDayjs}>
                <StyleManager>
                    <ActionBar data={mockData} selected={selectedIndices} />
                </StyleManager>
            </LocalizationProvider>
        );
    };

    it("should render", () => {
        cy.mount(<Component />);
    });

    it("should open the menu when the status button is clicked", () => {
        cy.mount(<Component />);
        cy.get("#status-button").click();
        cy.get("#status-menu").should("exist");
    });

    it("should update the button text when statuses are selected", () => {
        cy.mount(<Component />);
        cy.get("#status-button").click();
        cy.get("#status-menu").should("exist");
        cy.get("#status-menu").contains("Request Denied").click();
        cy.get("#status-modal-button").contains("Apply 1 status to 1 item");
        cy.get(".MuiBackdrop-root").trigger("keydown", { key: "Escape", force: true });
    });

    it("should open the modal when the modal button is clicked when an item is selected", () => {
        cy.mount(<Component />);
        cy.get("#status-button").click();
        cy.get("#status-menu").should("exist");
        cy.get("#status-menu").contains("Request Denied").click();
        cy.get(".MuiBackdrop-root").trigger("keydown", { key: "Escape", force: true });
        cy.get("#status-modal-button").click();
        cy.get("#status-modal-header").should("exist");
    });

    it("should not open the modal when the modal button is clicked when no items are selected", () => {
        cy.mount(<Component />);
        cy.get("#status-modal-button").click();
        cy.get("#status-modal-header").should("not.exist");
    });

    it("should contain all of the selected statuses in the modal", () => {
        const statuses = [
            "Request Denied",
            "Pending More Info",
            "Ready to Dispatch",
            "Delivery Failed",
            "Delivery Cancelled",
        ];

        cy.mount(<Component />);
        cy.get("#status-button").click();
        cy.get("#status-menu").should("exist");
        statuses.forEach((status) => {
            cy.get("#status-menu").contains(status).click();
        });
        cy.get(".MuiBackdrop-root").trigger("keydown", { key: "Escape", force: true });
        cy.get("#status-modal-button").click();
        cy.get("#status-modal-header").should("exist");
        statuses.forEach((status) => {
            cy.get(".MuiPaper-root").contains(status);
        });
    });

    it("should close the modal when the close button is clicked", () => {
        cy.mount(<Component />);
        cy.get("#status-button").click();
        cy.get("#status-menu").should("exist");
        cy.get("#status-menu").contains("Request Denied").click();
        cy.get(".MuiBackdrop-root").trigger("keydown", { key: "Escape", force: true });
        cy.get("#status-modal-button").click();
        cy.get("#status-modal-header").should("exist");
        cy.get("[aria-label='Close Button']").click();
        cy.get("#status-modal-header").should("not.exist");
    });

    it("should have a modal with date and time pickers", () => {
        cy.mount(<Component />);
        cy.get("#status-button").click();
        cy.get("#status-menu").should("exist");
        cy.get("#status-menu").contains("Request Denied").click();
        cy.get(".MuiBackdrop-root").trigger("keydown", { key: "Escape", force: true });
        cy.get("#status-modal-button").click();
        cy.get("#status-modal-header").should("exist");
        cy.get(".MuiPaper-root").contains("Date");
        cy.get(".MuiPaper-root").contains("Time");
        const dateString = new Date().toLocaleDateString("en-GB");
        cy.get("input[value='" + dateString + "']").should("exist");
        const timeString = new Date().toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
        });
        cy.get("input[value='" + timeString + "']").should("exist");
    });
});
