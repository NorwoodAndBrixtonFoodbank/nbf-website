import { v4 as uuidv4 } from "uuid";

describe("Edit a collection centre on admins page", () => {
    beforeEach(() => {
        cy.login();
        cy.visit("/admin");
    });

    it("Adds a collection centre and hides it successfully", () => {
        const newCollectionCentreName = `${uuidv4()}`;
        toggleCollectionCentreSection();

        cy.get('div[aria-label="Collection Centres Table"]').as("ccTable"); // eslint-disable-line quotes

        cy.get("@ccTable")
            .find('[data-testid="AddIcon"]') // eslint-disable-line quotes
            .click();

        // Add the new collection centre and save
        cy.get("@ccTable").find(".MuiDataGrid-row--editing").as("newRow"); // eslint-disable-line quotes

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

        // Find the newly-created row and edit it
        cy.get("@ccTable")
            .contains(".MuiDataGrid-cellContent", newCollectionCentreName)
            .parents(".MuiDataGrid-row")
            .as("newlyAddedRow");

        cy.get("@newlyAddedRow").find('[data-testid="EditIcon"]').click(); // eslint-disable-line quotes

        // Uncheck the 'isShown' checkbox and save the row
        cy.get("@ccTable").find(".MuiDataGrid-row--editing").as("rowBeingEdited");

        cy.get("@rowBeingEdited")
            .find('[data-field="isShown"]') // eslint-disable-line quotes
            .find('[type="checkbox"]') // eslint-disable-line quotes
            .uncheck();

        cy.get("@rowBeingEdited")
            .find('[data-testid="SaveIcon"]') // eslint-disable-line quotes
            .click();

        // Check the row appears as 'not shown'
        cy.get("@ccTable")
            .contains(".MuiDataGrid-cellContent", newCollectionCentreName)
            .parents(".MuiDataGrid-row")
            .as("newlyEditedRow");

        cy.get("@newlyEditedRow")
            .find('[data-field="isShown"]') // eslint-disable-line quotes
            .find('[data-testid="CloseIcon"]') // eslint-disable-line quotes
            .should("exist");
    });
});

function toggleCollectionCentreSection(): void {
    cy.get('[aria-label="Section: Collection Centres"]').click(); // eslint-disable-line quotes
}
