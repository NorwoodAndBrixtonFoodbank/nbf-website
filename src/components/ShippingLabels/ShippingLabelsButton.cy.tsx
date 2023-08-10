import React from "react";
import ShippingsLabelButton from "@/components/ShippingLabels/ShippingLabelsButton";
import { ParcelClients } from "@/components/ShippingLabels/ShippingLabelsPdf";

const downloadsFolder = Cypress.config("downloadsFolder");
const fileName = "ShippingLabels.pdf";
const data: ParcelClients[][] = [
    [
        {
            packing_datetime: "19/06/2023",
            collection_centre: "Delivery",
            collection_datetime: "31/07/2023, 14:00",
            voucher_number: "voucher-number-1",
            full_name: "Harry Potter",
            phone_number: "07987654321",
            address_1: "Hogwarts Castle",
            address_2: "",
            address_town: "Scottish Highlands",
            address_county: "United Kingdom",
            address_postcode: "YE11OW",
            delivery_instructions: "Owls only no floo powder please.",
            index: 1,
            total: 2,
        },
        {
            packing_datetime: "20/06/2023",
            collection_centre: "Delivery",
            collection_datetime: "31/08/2023, 14:00",
            voucher_number: "voucher-number-2",
            full_name: "Nessie",
            phone_number: "0799999999",
            address_1: "Loch Ness",
            address_2: "Inverness",
            address_town: "Scottish Highlands",
            address_county: "United Kingdom",
            address_postcode: "NE55IE",
            delivery_instructions: "Throw it in the water and leave as quickly as possible.",
            index: 2,
            total: 2,
        },
    ],
];

const allFields = data[0]
    .map((obj) => {
        return Object.values(obj);
    })
    .flat();

describe("Export Pdf Button", () => {
    it("renders", () => {
        cy.mount(<ShippingsLabelButton text="Click" data={data} />);
    });

    it("File is saved", () => {
        cy.mount(<ShippingsLabelButton text="Click" data={data} />);

        cy.get("a").click();
        cy.readFile(`${downloadsFolder}/${fileName}`);
    });

    it(
        "All data is included in the file",
        {
            retries: {
                runMode: 1,
                openMode: 1,
            },
        },
        () => {
            cy.mount(<ShippingsLabelButton text="Click" data={data} />);

            cy.get("a").click();
            cy.readFile(`${downloadsFolder}/${fileName}`);

            for (const field of allFields) {
                cy.task("readPdf", `${downloadsFolder}/${fileName}`).should("contain", field);
            }
        }
    );
});
