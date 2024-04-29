describe("Edit a collection centre on admins page", () => {
    beforeEach(() => {
        cy.login();
        cy.visit("/admin");
    });

    it("Hides a collection centre successfully", () => {
        toggleCollectionCentreSection();

        assertCollectionCentreName({ rowIndex: 2, collectionCentreName: "Delivery" });

        clickOnEditButton(2);
        uncheckIsShownCheckbox(2);
        clickOnSaveButton(2);
        collectionCentreIsHidden(2);
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
        .find(`[data-rowindex="${rowIndex}"]`) // eslint-disable-line quotes
        .find('[data-field="name"]') // eslint-disable-line quotes
        .should(($slotName) => {
            expect($slotName).to.contain(collectionCentreName);
        });
}

function clickOnEditButton(rowIndex: number): void {
    cy.contains(collectionCentresTableText, { matchCase: false })
        .parents(".MuiPaper-root")
        .find(`[data-rowindex="${rowIndex}"]`)
        .find('[data-testid="EditIcon"]') // eslint-disable-line quotes
        .click();
}

function uncheckIsShownCheckbox(rowIndex: number): void {
    cy.contains(collectionCentresTableText, { matchCase: false })
        .parents(".MuiPaper-root")
        .find(`[data-rowindex="${rowIndex}"]`)
        .find('[type="checkbox"]') // eslint-disable-line quotes
        .uncheck();
}

function clickOnSaveButton(rowIndex: number): void {
    cy.contains(collectionCentresTableText, { matchCase: false })
        .parents(".MuiPaper-root")
        .find(`[data-rowindex="${rowIndex}"]`)
        .find('[data-testid="SaveIcon"]') // eslint-disable-line quotes
        .click();
}

function collectionCentreIsHidden(rowIndex: number): void {
    cy.contains(collectionCentresTableText, { matchCase: false })
        .parents(".MuiPaper-root")
        .find(`[data-rowindex="${rowIndex}"]`)
        .find('[data-testid="CloseIcon"]') // eslint-disable-line quotes
        .should("exist");
}
