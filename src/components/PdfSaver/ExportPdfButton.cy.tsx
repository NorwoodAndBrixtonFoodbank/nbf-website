import React, { useRef } from "react";
import ExportPdfButton from "@/components/PdfSaver/ExportPdfButton";

const fileName = "ThisIsATestFile";
const downloadsFolder = Cypress.config("downloadsFolder");
const title = "Lorem ipsum dolor sit amet";
const body = "consectetur adipiscing elit, sed do eiusmod tempor";

const PdfBodyAndButton: React.FC = () => {
    const pdfRef = useRef<HTMLDivElement | null>(null);

    return (
        <>
            <div ref={pdfRef}>
                <h1>{title}</h1>
                <p>{body}</p>
            </div>
            <ExportPdfButton pdfRef={pdfRef} fileName={fileName} />
        </>
    );
};

describe("Export Pdf Button", () => {
    it("renders", () => {
        cy.mount(<PdfBodyAndButton />);
    });

    it("File is saved", () => {
        cy.mount(<PdfBodyAndButton />);

        cy.get("button").click();
        cy.readFile(`${downloadsFolder}/${fileName}.pdf`);
    });

    it("Content in the file is correct", () => {
        cy.mount(<PdfBodyAndButton />);

        cy.get("button").click();
        cy.task("readPdf", `${downloadsFolder}/${fileName}.pdf`).should("contain", title);
        cy.task("readPdf", `${downloadsFolder}/${fileName}.pdf`).should("contain", body);
    });
});
