import ActionBar from "@/app/clients/ActionBar/ActionBar";
import React from "react";
import StyleManager from "@/app/themes";
import { ClientsTableRow } from "@/app/clients/getClientsTableData";
import Localization from "@/app/localizationProvider";

describe("Clients - Action Bar", () => {
    const mockData: ClientsTableRow[] = [
        {
            primaryKey: "primaryKey1",
            addressPostcode: "AB1 2CD",
            collectionCentre: "Centre 1",
            collectionDatetime: new Date().toISOString(),
            congestionChargeApplies: false,
            familyCategory: "Family 1",
            fullName: "John Smith",
            lastStatus: "Delivered",
            packingDatetime: new Date().toISOString(),
            packingTimeLabel: "10:00",
            parcelId: "123456789",
            requiresFollowUpPhoneCall: false,
            flaggedForAttention: false,
            voucherNumber: "123456789",
        },
        {
            primaryKey: "primaryKey2",
            addressPostcode: "AB1 aaaa2CD",
            collectionCentre: "Centraaaae 1",
            collectionDatetime: new Date().toISOString(),
            congestionChargeApplies: true,
            familyCategory: "Familaaaay 1",
            fullName: "John Smaaaaith",
            lastStatus: "Deliveaaaared",
            packingDatetime: new Date().toISOString(),
            packingTimeLabel: "10aaaa:00",
            parcelId: "123456aaaa789",
            requiresFollowUpPhoneCall: false,
            flaggedForAttention: false,
            voucherNumber: "123456aaaa789",
        },
    ];

    interface Props {
        selected: number[];
    }

    const MockActionBar: React.FC<Props> = ({ selected }) => {
        return (
            <Localization>
                <StyleManager>
                    <ActionBar data={mockData} selected={selected} />
                </StyleManager>
            </Localization>
        );
    };
    describe("Statuses", () => {
        const selectedIndices = [0, 1];

        beforeEach(() => {
            cy.mount(<MockActionBar selected={selectedIndices} />);
        });

        it("should open the status menu when the status button is clicked", () => {
            cy.get("#status-button").click();
            cy.get("#status-menu").should("exist");
        });

        it("should open the modal when an item is selected", () => {
            cy.get("#status-button").click();
            cy.get("#status-menu").should("exist");
            cy.get("#status-menu").contains("Request Denied").click();
            cy.get("#status-modal-header").should("exist");
        });

        it("should close the modal when the close button is clicked", () => {
            cy.get("#status-button").click();
            cy.get("#status-menu").should("exist");
            cy.get("#status-menu").contains("Request Denied").click();
            cy.get("#status-modal-header").should("exist");
            cy.get("[aria-label='Close Button']").click();
            cy.get("#status-modal-header").should("not.exist");
        });

        it("should have a modal with date and time pickers", () => {
            cy.get("#status-button").click();
            cy.get("#status-menu").should("exist");
            cy.get("#status-menu").contains("Request Denied").click();
            cy.get("#status-modal-header").should("exist");
            cy.get(".MuiPaper-root").contains("Date");
            cy.get(".MuiPaper-root").contains("Time");
            const dateString = new Date().toLocaleDateString("en-GB");
            cy.get(`input[value="${dateString}"]`).should("exist");
            const timeString = new Date().toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
            });
            cy.get(`input[value="${timeString}"]`).should("exist");
        });

        it("should have a modal that contains the selected data", () => {
            cy.get("#status-button").click();
            cy.get("#status-menu").should("exist");
            cy.get("#status-menu").contains("Request Denied").click();
            cy.get("#status-modal-header").should("exist");
            cy.get(".MuiPaper-root").contains("Date");
            cy.get(".MuiPaper-root").contains("Time");
            const dateString = new Date().toLocaleDateString("en-GB");
            cy.get(`input[value="${dateString}"]`).should("exist");
            const timeString = new Date().toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
            });
            cy.get(`input[value="${timeString}"]`).should("exist");
            selectedIndices.forEach((index) => {
                cy.get(".MuiPaper-root").contains(mockData[index].collectionCentre);
                cy.get(".MuiPaper-root").contains(mockData[index].fullName);
            });
        });
    });

    describe("Actions", () => {
        const row = mockData[0];

        beforeEach(() => {
            cy.mount(<MockActionBar selected={[0]} />);
        });

        it("should open the action menu when the action button is clicked", () => {
            cy.get("#action-button").click();
            cy.get("#action-menu").should("exist");
        });

        it("should open the modal when an item is selected", () => {
            cy.get("#action-button").click();
            cy.get("#action-menu").should("exist");
            cy.get("#action-menu").contains("Download Shopping List").click();
            cy.get("#action-modal-header").should("exist");
        });

        it("should close the modal when the close button is clicked", () => {
            cy.get("#action-button").click();
            cy.get("#action-menu").should("exist");
            cy.get("#action-menu").contains("Download Shopping List").click();
            cy.get("#action-modal-header").should("exist");
            cy.get("[aria-label='Close Button']").click();
            cy.get("#action-modal-header").should("not.exist");
        });

        it("should have a modal that contains the selected data", () => {
            cy.get("#action-button").click();
            cy.get("#action-menu").should("exist");
            cy.get("#action-menu").contains("Download Shopping List").click();
            cy.get("#action-modal-header").should("exist");
            cy.get(".MuiPaper-root").contains(row.collectionCentre);
            cy.get(".MuiPaper-root").contains(row.fullName);
        });
    });
});
