import ActionBar from "@/app/parcels/ActionBar/ActionBar";
import { ParcelsTableRow } from "@/app/parcels/getParcelsTableData";
import React from "react";
import StyleManager from "@/app/themes";
import Localization from "@/app/Localization";

describe("Clients - Action Bar", () => {
    const mockData: ParcelsTableRow[] = [
        {
            primaryKey: "primaryKey1",
            addressPostcode: "AB1 2CD",
            deliveryCollection: {
                collectionCentreName: "Centre 1",
                collectionCentreAcronym: "C1",
                congestionChargeApplies: false,
            },
            collectionDatetime: new Date(),
            familyCategory: 1,
            fullName: "John Smith",
            lastStatus: {
                name: "Delivered",
                eventData: "Some information",
                timestamp: new Date(),
            },
            packingDatetime: new Date(),
            packingTimeLabel: "AM",
            parcelId: "123456789",
            iconsColumn: {
                requiresFollowUpPhoneCall: false,
                flaggedForAttention: false,
            },
            voucherNumber: "123456789",
        },
        {
            primaryKey: "primaryKey2",
            addressPostcode: "AB1 aaaa2CD",
            deliveryCollection: {
                collectionCentreName: "Centraaaae 1",
                collectionCentreAcronym: "C2",
                congestionChargeApplies: true,
            },
            collectionDatetime: new Date(),
            familyCategory: 1,
            fullName: "John Smaaaaith",
            lastStatus: {
                name: "Called and Confirmed",
                eventData: null,
                timestamp: new Date(),
            },
            packingDatetime: new Date(),
            packingTimeLabel: "PM",
            parcelId: "123456aaaa789",
            iconsColumn: {
                requiresFollowUpPhoneCall: false,
                flaggedForAttention: false,
            },
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
                cy.get(".MuiPaper-root").contains(mockData[index].addressPostcode);
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
            cy.get(".MuiPaper-root").contains(row.addressPostcode);
            cy.get(".MuiPaper-root").contains(row.fullName);
        });
    });
});
