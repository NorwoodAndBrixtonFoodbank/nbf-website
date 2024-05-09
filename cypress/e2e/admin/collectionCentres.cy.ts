import { v4 as uuidv4 } from "uuid";

describe("Edit a collection centre on admins page", () => {
    beforeEach(() => {
        cy.login();
        cy.visit("/admin");
    });

    it("Adds a collection centre and hides it successfully", () => {
        toggleCollectionCentreSection();
        assertCollectionCentreName({
            rowIndex: 2,
            collectionCentreName: "Brixton Hill - Methodist Church",
        });
        clickOnAddButton();
        getNumberOfAriaRows().then((lastRow) => {
            const newCollectionCentreName = generateRandomCollectionCentreText();
            addCollectionCentreName(lastRow, newCollectionCentreName);
            addCollectionCentreAcronym(lastRow, newCollectionCentreName);
            clickOnSaveButton(lastRow);
            assertCollectionCentreName({
                rowIndex: lastRow,
                collectionCentreName: newCollectionCentreName,
            });
            clickOnEditButton(lastRow);
            uncheckIsShownCheckbox(lastRow);
            clickOnSaveButton(lastRow);
            collectionCentreIsHidden(lastRow);
        });
    });
});

const collectionCentresTableText = "collection centres table";
function toggleCollectionCentreSection(): void {
    cy.contains(collectionCentresTableText, { matchCase: false }).click();
}

function assertCollectionCentreName({
    rowIndex,
    collectionCentreName,
}: {
    rowIndex: number;
    collectionCentreName: string;
}): void {
    cy.contains(collectionCentresTableText, { matchCase: false })
        .parents(".MuiPaper-root")
        .find(`[aria-rowindex="${rowIndex}"]`) // eslint-disable-line quotes
        .find('[data-field="name"]') // eslint-disable-line quotes
        .should(($slotName) => {
            expect($slotName).to.contain(collectionCentreName);
        });
}

function clickOnAddButton(): void {
    cy.contains(collectionCentresTableText, { matchCase: false })
        .parents(".MuiPaper-root")
        .find('[data-testid="AddIcon"]') // eslint-disable-line quotes
        .click();
}

function getNumberOfAriaRows(): Cypress.Chainable<number> {
    return cy
        .contains(collectionCentresTableText, { matchCase: false })
        .parents(".MuiPaper-root")
        .get('[aria-colcount="4"]') // eslint-disable-line quotes
        .invoke("attr", "aria-rowcount")
        .then((ariaRowCount) => {
            const rowCount: number = parseInt(ariaRowCount as string, 10);
            return cy.wrap(rowCount);
        });
}

function addCollectionCentreName(rowIndex: number, text: string): void {
    cy.contains(collectionCentresTableText, { matchCase: false })
        .parents(".MuiPaper-root")
        .find(`[aria-rowindex="${rowIndex}"]`)
        .get('[data-field="name"]') // eslint-disable-line quotes
        .find('input[type="text"]') // eslint-disable-line quotes
        .type(text);
}

function addCollectionCentreAcronym(rowIndex: number, text: string): void {
    cy.contains(collectionCentresTableText, { matchCase: false })
        .parents(".MuiPaper-root")
        .find(`[aria-rowindex="${rowIndex}"]`)
        .get('[data-field="acronym"]') // eslint-disable-line quotes
        .find('input[type="text"]') // eslint-disable-line quotes
        .type(text);
}

function generateRandomCollectionCentreText(): string {
    const uuid = uuidv4();
    return `z${uuid}`;
}

function clickOnEditButton(rowIndex: number): void {
    cy.contains(collectionCentresTableText, { matchCase: false })
        .parents(".MuiPaper-root")
        .find(`[aria-rowindex="${rowIndex}"]`)
        .find('[data-testid="EditIcon"]') // eslint-disable-line quotes
        .click();
}

function uncheckIsShownCheckbox(rowIndex: number): void {
    cy.contains(collectionCentresTableText, { matchCase: false })
        .parents(".MuiPaper-root")
        .find(`[aria-rowindex="${rowIndex}"]`)
        .find('[type="checkbox"]') // eslint-disable-line quotes
        .uncheck();
}

function clickOnSaveButton(rowIndex: number): void {
    cy.contains(collectionCentresTableText, { matchCase: false })
        .parents(".MuiPaper-root")
        .find(`[aria-rowindex="${rowIndex}"]`)
        .find('[data-testid="SaveIcon"]') // eslint-disable-line quotes
        .click();
}

function collectionCentreIsHidden(rowIndex: number): void {
    cy.contains(collectionCentresTableText, { matchCase: false })
        .parents(".MuiPaper-root")
        .find(`[aria-rowindex="${rowIndex}"]`)
        .find('[data-testid="CloseIcon"]') // eslint-disable-line quotes
        .should("exist");
}
