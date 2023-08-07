import { Schema } from "@/supabase";
import ActionBar from "@/app/clients/ActionBar";
import React from "react";
import StyleManager from "@/app/themes";

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

    const MockActionBar: React.FC<{}> = () => {
        return (
            <StyleManager>
                <ActionBar data={mockData} selected={selectedIndices} />
            </StyleManager>
        );
    };

    beforeEach(() => {
        cy.mount(<MockActionBar />);
    });

    it("should render", () => {});

    [
        ["status", "Request Denied"],
        ["action", "Print Shopping List"],
    ].forEach(([type, example]) => {
        describe(`${type} menu`, () => {
            it(`should open the menu when the ${type} button is clicked`, () => {
                cy.get(`#${type}-button`).click();
                cy.get(`#${type}-menu`).should("exist");
            });

            it("should open the modal when an item is selected", () => {
                cy.get(`#${type}-button`).click();
                cy.get(`#${type}-menu`).should("exist");
                cy.get(`#${type}-menu`).contains(example).click();
                cy.get(`#${type}-modal-header`).should("exist");
            });

            it("should close the modal when the close button is clicked", () => {
                cy.get(`#${type}-button`).click();
                cy.get(`#${type}-menu`).should("exist");
                cy.get(`#${type}-menu`).contains(example).click();
                cy.get(`#${type}-modal-header`).should("exist");
                cy.get("[aria-label='Close Button']").click();
                cy.get(`#${type}-modal-header`).should("not.exist");
            });

            it("should have a modal with date and time pickers", () => {
                cy.get(`#${type}-button`).click();
                cy.get(`#${type}-menu`).should("exist");
                cy.get(`#${type}-menu`).contains(example).click();
                cy.get(`#${type}-modal-header`).should("exist");
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
    });
});
