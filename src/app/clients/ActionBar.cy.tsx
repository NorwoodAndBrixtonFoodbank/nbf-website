import ActionBar from "@/app/clients/ActionBar";
import React from "react";
import StyleManager from "@/app/themes";
import { ClientsTableRow } from "@/app/clients/getClientsTableData";
import Localization from "@/app/localizationProvider";
import { Schema } from "@/database_utils";

describe("Clients - Action Bar", () => {
    const mockData: ClientsTableRow[] = [
        {
            primaryKey: "primaryKey1",
            addressPostcode: "AB1 2CD",
            deliveryCollection: {
                collectionCentre: "Centre 1",
                congestionChargeApplies: false,
            },
            collectionDatetime: new Date().toISOString(),
            familyCategory: "Family 1",
            fullName: "John Smith",
            lastStatus: "Delivered",
            packingDatetime: new Date().toISOString(),
            packingTimeLabel: "10:00",
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
            deliveryCollection: { collectionCentre: "Centraaaae 1", congestionChargeApplies: true },
            collectionDatetime: new Date().toISOString(),
            familyCategory: "Familaaaay 1",
            fullName: "John Smaaaaith",
            lastStatus: "Deliveaaaared",
            packingDatetime: new Date().toISOString(),
            packingTimeLabel: "10aaaa:00",
            parcelId: "123456aaaa789",
            iconsColumn: {
                requiresFollowUpPhoneCall: false,
                flaggedForAttention: false,
            },
            voucherNumber: "123456aaaa789",
        },
    ];

    const mockClientsData: Schema["clients"] = {
        address_1: "123",
        address_2: "Gem Lane",
        address_county: "Gemmashire",
        address_postcode: "GE33AA",
        address_town: "Gemm",
        baby_food: null,
        delivery_instructions: "Get some gem",
        dietary_requirements: ["I eat gems"],
        extra_information: "Gems",
        family_id: "789456123",
        feminine_products: ["Gems"],
        flagged_for_attention: false,
        full_name: "John Smith",
        other_items: [],
        pet_food: [],
        phone_number: "0123456789",
        primary_key: "primeKey",
        signposting_call_required: false,
    };

    const mockFamiliesData: Schema["families"] = {
        age: 1,
        family_id: "789456123",
        gender: "female",
        primary_key: "7894561235",
    };

    const mockListsData: Schema["lists"] = {
        "1_notes": null,
        "1_quantity": "1",
        "10_notes": null,
        "10_quantity": "1",
        "2_notes": null,
        "2_quantity": "1",
        "3_notes": null,
        "3_quantity": "1",
        "4_notes": null,
        "4_quantity": "1",
        "5_notes": null,
        "5_quantity": "1",
        "6_notes": null,
        "6_quantity": "1",
        "7_notes": null,
        "7_quantity": "1",
        "8_notes": null,
        "8_quantity": "1",
        "9_notes": null,
        "9_quantity": "1",
        item_name: "Eggs",
        primary_key: "012345689",
        row_order: 5,
    };

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
                cy.get(".MuiPaper-root").contains(
                    mockData[index].deliveryCollection.collectionCentre
                );
                cy.get(".MuiPaper-root").contains(mockData[index].fullName);
            });
        });
    });

    describe("Actions", () => {
        const row = mockData[0];

        beforeEach(() => {
            cy.mount(<MockActionBar selected={[0]} />);
            cy.intercept("GET", "https://*.supabase.co/rest/*/parcels?select=*&primary_key=eq.*", {
                statusCode: 200,
                body: [row],
            }).as("interceptParcels");

            cy.intercept("GET", "https://*.supabase.co/rest/*/clients?select=*&primary_key=eq.*", {
                statusCode: 200,
                body: [mockClientsData],
            }).as("interceptClients");

            cy.intercept("GET", "https://*.supabase.co/rest/*/families?select=*&family_id=eq.*", {
                statusCode: 200,
                body: [mockFamiliesData],
            }).as("interceptFamilies");

            cy.intercept("GET", "https://*.supabase.co/rest/*/lists?select=*", {
                statusCode: 200,
                body: [mockListsData],
            }).as("interceptLists");

            cy.intercept(
                "GET",
                "https://*.supabase.co/rest/*/website_data?select=*&name=eq.lists_text",
                {
                    statusCode: 200,
                    body: [{ value: "Hello worlds" }],
                }
            ).as("interceptWebData");
        });

        it("should open the action menu when the action button is clicked", () => {
            cy.get("#action-button").click();
            cy.get("#action-menu").should("exist");
        });

        it("should open the modal when an item is selected", () => {
            cy.get("#action-button").click();
            cy.get("#action-menu").should("exist");
            cy.get("#action-menu").contains("Print Shopping List").click();
            cy.wait([
                "@interceptParcels",
                "@interceptClients",
                "@interceptFamilies",
                "@interceptLists",
                "@interceptWebData",
            ]);
            cy.get("#action-modal-header").should("exist");
        });

        it("should close the modal when the close button is clicked", () => {
            cy.get("#action-button").click();
            cy.get("#action-menu").should("exist");
            cy.get("#action-menu").contains("Print Shopping List").click();
            cy.wait([
                "@interceptParcels",
                "@interceptClients",
                "@interceptFamilies",
                "@interceptLists",
                "@interceptWebData",
            ]);
            cy.get("#action-modal-header").should("exist");
            cy.get("[aria-label='Close Button']").click();
            cy.get("#action-modal-header").should("not.exist");
        });

        it("should have a modal that contains the selected data", () => {
            cy.get("#action-button").click();
            cy.get("#action-menu").should("exist");
            cy.get("#action-menu").contains("Print Shopping List").click();
            cy.wait([
                "@interceptParcels",
                "@interceptClients",
                "@interceptFamilies",
                "@interceptLists",
                "@interceptWebData",
            ]);
            cy.get("#action-modal-header").should("exist");
            cy.get(".MuiPaper-root").contains(row.deliveryCollection.collectionCentre);
            cy.get(".MuiPaper-root").contains(row.fullName);
        });
    });
});
