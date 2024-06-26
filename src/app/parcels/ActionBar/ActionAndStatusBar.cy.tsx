import ActionAndStatusBar, {
    ActionAndStatusBarProps,
} from "@/app/parcels/ActionBar/ActionAndStatusBar";
import { ParcelsTableRow } from "../parcelsTable/types";
import React from "react";
import StyleManager from "@/app/themes";
import Localization from "@/app/Localization";
import { SaveParcelStatusResult } from "./Statuses";

describe("Parcels - Action Bar", () => {
    const mockData: ParcelsTableRow[] = [
        {
            clientId: "primaryKey1",
            addressPostcode: "AB1 2CD",
            phoneNumber: "0987 654321",
            deliveryCollection: {
                collectionCentreName: "Centre 1",
                collectionCentreAcronym: "C1",
                congestionChargeApplies: false,
            },
            collectionDatetime: new Date(),
            familyCategory: "Single",
            fullName: "John Smith",
            lastStatus: {
                name: "Delivered",
                eventData: "Some information",
                timestamp: new Date(),
                workflowOrder: 1,
            },
            packingDate: new Date(),
            packingSlot: "AM",
            parcelId: "123456789",
            iconsColumn: {
                requiresFollowUpPhoneCall: false,
                flaggedForAttention: false,
            },
            voucherNumber: "123456789",
            createdAt: new Date("2023-12-31T12:00:00+00:00"),
            clientIsActive: true,
        },
        {
            clientId: "primaryKey2",
            addressPostcode: "AB1 aaaa2CD",
            phoneNumber: "+1 234 567",
            deliveryCollection: {
                collectionCentreName: "Centraaaae 1",
                collectionCentreAcronym: "C2",
                congestionChargeApplies: true,
            },
            collectionDatetime: new Date(),
            familyCategory: "Family of 4",
            fullName: "John Smaaaaith",
            lastStatus: {
                name: "Called and Confirmed",
                eventData: null,
                timestamp: new Date(),
                workflowOrder: 2,
            },
            packingDate: new Date(),
            packingSlot: "PM",
            parcelId: "123456aaaa789",
            iconsColumn: {
                requiresFollowUpPhoneCall: false,
                flaggedForAttention: false,
            },
            voucherNumber: "123456aaaa789",
            createdAt: new Date("2023-12-31T12:00:00+00:00"),
            clientIsActive: true,
        },
    ];

    const MockActionBar: React.FC<ActionAndStatusBarProps> = ({
        fetchSelectedParcels: fetchSelectedParcels,
        updateParcelStatuses: onDeleteParcels,
    }) => {
        return (
            <Localization>
                <StyleManager>
                    <ActionAndStatusBar
                        fetchSelectedParcels={fetchSelectedParcels}
                        updateParcelStatuses={onDeleteParcels}
                    />
                </StyleManager>
            </Localization>
        );
    };
    describe("Statuses", () => {
        let parcelIds: string[] = ["123456789", "123456aaaa789"];
        const onDeleteParcels = async (): Promise<SaveParcelStatusResult> => {
            parcelIds = [];
            return { error: null };
        };

        beforeEach(() => {
            cy.mount(
                <MockActionBar
                    fetchSelectedParcels={async () =>
                        await mockData.filter((parcel) => parcelIds.includes(parcel.parcelId))
                    }
                    updateParcelStatuses={onDeleteParcels}
                />
            );
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
            mockData.forEach((parcel: ParcelsTableRow) => {
                if (parcel.addressPostcode) {
                    cy.get(".MuiPaper-root").contains(parcel.addressPostcode);
                }
                if (parcel.fullName) {
                    cy.get(".MuiPaper-root").contains(parcel.fullName);
                }
            });
        });
    });

    describe("Actions", () => {
        let parcelIds: string[] = ["123456789", "123456aaaa789"];
        const onDeleteParcels = async (): Promise<SaveParcelStatusResult> => {
            parcelIds = [];
            return { error: null };
        };
        const row = mockData[0];

        beforeEach(() => {
            cy.mount(
                <MockActionBar
                    fetchSelectedParcels={async () =>
                        await mockData.filter((parcel) => parcelIds.includes(parcel.parcelId))
                    }
                    updateParcelStatuses={onDeleteParcels}
                />
            );
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
            if (row.addressPostcode) {
                cy.get(".MuiPaper-root").contains(row.addressPostcode);
            }
            if (row.fullName) {
                cy.get(".MuiPaper-root").contains(row.fullName);
            }
        });
    });
});
