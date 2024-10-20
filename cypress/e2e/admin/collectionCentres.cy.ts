import { v4 as uuidv4 } from "uuid";

describe("Edit a collection centre on admins page", () => {
    beforeEach(() => {
        cy.login();
        cy.visit("/admin");
    });

    it("Adds a collection centre and hides it successfully", () => {
        toggleCollectionCentreSection();
        cy.get('div[aria-label="Collection Centres Table"]') // eslint-disable-line quotes
            .find(".MuiDataGrid-row", { timeout: 5000 })
            .should("be.visible");

        const newCollectionCentreName = `${uuidv4()}`;
        cy.get('div[aria-label="Collection Centres Table"]') // eslint-disable-line quotes
            .find(newCollectionCentreName)
            .should("not.exist"); // If this fails then the random UUID is already there

        startAddingNewCollectionCentre();
        cy.get('div[aria-label="Collection Centres Table"]') // eslint-disable-line quotes
            .find(".MuiDataGrid-row--editing", { timeout: 5000 })
            .should("exist");

        fillOutNewCollectionCentreRowAndSave(newCollectionCentreName);
        cy.get('div[aria-label="Collection Centres Table"]') // eslint-disable-line quotes
            .contains(".MuiDataGrid-cellContent", newCollectionCentreName, { timeout: 5000 })
            .should("exist");

        startEditingCollectionCentreRow(newCollectionCentreName);
        cy.get('div[aria-label="Collection Centres Table"]') // eslint-disable-line quotes
            .find(".MuiDataGrid-row--editing", { timeout: 5000 })
            .should("exist");

        uncheckIsShownInRowBeingEditedAndSave();
        cy.get('div[aria-label="Collection Centres Table"]') // eslint-disable-line quotes
            .contains(".MuiDataGrid-cellContent", newCollectionCentreName, { timeout: 5000 })
            .should("exist");

        // Check the cc row appears as 'not shown'
        cy.get('div[aria-label="Collection Centres Table"]') // eslint-disable-line quotes
            .contains(newCollectionCentreName, { timeout: 5000 })
            .parents(".MuiDataGrid-row")
            .as("newlyEditedRow");

        cy.get("@newlyEditedRow")
            .find('[data-field="isShown"]') // eslint-disable-line quotes
            .find('[data-testid="CloseIcon"]') // eslint-disable-line quotes
            .should("exist");
    });
});

const toggleCollectionCentreSection = (): void => {
    cy.get('[aria-label="Section: Collection Centres"]').click(); // eslint-disable-line quotes
};

const startAddingNewCollectionCentre = (): void => {
    cy.get('div[aria-label="Collection Centres Table"]') // eslint-disable-line quotes
        .find('[data-testid="AddIcon"]') // eslint-disable-line quotes
        .click();
};

const fillOutNewCollectionCentreRowAndSave = (newCollectionCentreName: string): void => {
    cy.get('div[aria-label="Collection Centres Table"]') // eslint-disable-line quotes
        .find(".MuiDataGrid-row--editing")
        .as("newRow");

    cy.get("@newRow")
        .find('[data-field="name"]') // eslint-disable-line quotes
        .find('input[type="text"]') // eslint-disable-line quotes
        .type(newCollectionCentreName);

    cy.get("@newRow")
        .find('[data-field="acronym"]') // eslint-disable-line quotes
        .find('input[type="text"]') // eslint-disable-line quotes
        .type(newCollectionCentreName);

    cy.get("@newRow")
        .find('[data-testid="SaveIcon"]') // eslint-disable-line quotes
        .click();
};

const startEditingCollectionCentreRow = (collectionCentreName: string): void => {
    cy.get('div[aria-label="Collection Centres Table"]') // eslint-disable-line quotes
        .contains(collectionCentreName)
        .parents(".MuiDataGrid-row")
        .as("newlyAddedRow");

    cy.get("@newlyAddedRow").find('[data-testid="EditIcon"]').click(); // eslint-disable-line quotes
};

const uncheckIsShownInRowBeingEditedAndSave = (): void => {
    cy.get('div[aria-label="Collection Centres Table"]')
        .find(".MuiDataGrid-row--editing")
        .as("rowBeingEdited"); // eslint-disable-line quotes

    cy.get("@rowBeingEdited")
        .find('[data-field="isShown"]') // eslint-disable-line quotes
        .find('[type="checkbox"]') // eslint-disable-line quotes
        .uncheck();

    cy.get("@rowBeingEdited")
        .find('[data-testid="SaveIcon"]') // eslint-disable-line quotes
        .click();
};
