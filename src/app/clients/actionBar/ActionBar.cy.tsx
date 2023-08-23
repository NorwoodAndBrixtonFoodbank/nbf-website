import ActionBar from "@/app/clients/actionBar/ActionBar";
import React from "react";
import StyleManager from "@/app/themes";
import { ClientsTableRow } from "@/app/clients/getClientsTableData";
import Localization from "../../localizationProvider";

describe("Clients - Action Bar", () => {
    const mockData: ClientsTableRow[] = [
        {
            primaryKey: "primaryKey1",
            addressPostcode: "AB1 2CD",
            collectionCentre: "Centre 1",
            collectionDatetime: new Date().toISOString(),
            congestionChargeApplies: false,
            familyCategory: "Family 1",
            flaggedForAttention: false,
            fullName: "John Smith",
            lastStatusUpdate: new Date().toISOString(),
            lastStatus: "Delivered",
            packingDatetime: new Date().toISOString(),
            packingTimeLabel: "10:00",
            parcelId: "123456789",
            requiresFollowUpPhoneCall: false,
        },
        {
            primaryKey: "primaryKey2",
            addressPostcode: "AB1 aaaa2CD",
            collectionCentre: "Centraaaae 1",
            collectionDatetime: new Date().toISOString(),
            congestionChargeApplies: false,
            familyCategory: "Familaaaay 1",
            flaggedForAttention: false,
            fullName: "John Smaaaaith",
            lastStatusUpdate: new Date().toISOString(),
            lastStatus: "Deliveaaaared",
            packingDatetime: new Date().toISOString(),
            packingTimeLabel: "10aaaa:00",
            parcelId: "123456aaaa789",
            requiresFollowUpPhoneCall: false,
        },
    ];

    const selectedIndices = [0, 1];

    const MockActionBar: React.FC<{}> = () => {
        return (
            <Localization>
                <StyleManager>
                    <ActionBar data={mockData} selected={selectedIndices} />
                </StyleManager>
            </Localization>
        );
    };

    beforeEach(() => {
        cy.mount(<MockActionBar />);
    });

    it("should render", () => {});

    [
        ["status", "Request Denied"],
        ["action", "Download Shopping List"],
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
                cy.get(`input[value="${dateString}"]`).should("exist");
                const timeString = new Date().toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                });
                cy.get(`input[value="${timeString}"]`).should("exist");
            });

            it("should have a modal that contains the selected data", () => {
                cy.get(`#${type}-button`).click();
                cy.get(`#${type}-menu`).should("exist");
                cy.get(`#${type}-menu`).contains(example).click();
                cy.get(`#${type}-modal-header`).should("exist");
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
    });
});
