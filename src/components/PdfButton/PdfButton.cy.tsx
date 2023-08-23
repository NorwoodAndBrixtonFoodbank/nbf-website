import React from "react";
import PdfButton, { formatFileName } from "@/components/PdfButton/PdfButton";
import ShippingLabelsPDF, { ParcelClients } from "@/pdf/ShippingLabels/ShippingLabelsPDF";

const downloadsFolder = Cypress.config("downloadsFolder");
const fileName = "ShippingLabels.pdf";
const parcelClientsData: ParcelClients[] = [
    {
        packing_datetime: "19/06/2023",
        collection_centre: "Delivery",
        collection_datetime: "31/07/2023, 14:00",
        voucher_number: "VOUCHER-NUMBER-2",
        full_name: "Harry Potter",
        phone_number: "07987654321",
        address_1: "Hogwarts Castle",
        address_2: "",
        address_town: "Scottish Highlands",
        address_county: "United Kingdom",
        address_postcode: "YE11OW",
        delivery_instructions: "Owls only no floo powder please.",
    },
    {
        packing_datetime: "20/06/2023",
        collection_centre: "Delivery",
        collection_datetime: "31/08/2023, 14:00",
        voucher_number: "VOUCHER-NUMBER-2",
        full_name: "Nessie",
        phone_number: "0799999999",
        address_1: "Loch Ness",
        address_2: "Inverness",
        address_town: "Scottish Highlands",
        address_county: "United Kingdom",
        address_postcode: "NE55IE",
        delivery_instructions: "Throw it in the water and leave as quickly as possible.",
    },
];

const allFields = parcelClientsData
    .map((obj) => {
        return Object.values(obj);
    })
    .flat();

describe("Export Pdf Button", () => {
    beforeEach(() => {
        cy.mount(
            <PdfButton
                text="Click"
                fileName={fileName}
                data={parcelClientsData}
                pdfComponent={ShippingLabelsPDF}
            />
        );
    });

    it("Renders", () => {});

    it("File is saved", () => {
        cy.get("a").click();
        const formattedFileName = formatFileName(fileName);
        cy.readFile(`${downloadsFolder}/${formattedFileName}`);
    });

    it("All data of shipping label is included in the file", () => {
        cy.get("a").click();
        const formattedFileName = formatFileName(fileName);
        for (const field of allFields) {
            cy.task("readPdf", `${downloadsFolder}/${formattedFileName}`).should("contain", field);
        }
    });
});
