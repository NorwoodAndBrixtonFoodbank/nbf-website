const modifyPackingSlotsText = "modify packing slots";

describe("Packing slots on admins page", () => {
    it("Move the first packing slot down and then up", () => {
        cy.login();

        cy.visit("/admin");

        cy.contains(modifyPackingSlotsText, { matchCase: false }).click();

        assertPackingSlotName({ rowIndex: 0, packingSlotName: "AM" });
        assertPackingSlotName({ rowIndex: 1, packingSlotName: "PM" });

        movePackingSlot({ rowIndex: 0, direction: "down" });

        assertPackingSlotName({ rowIndex: 0, packingSlotName: "PM" });
        assertPackingSlotName({ rowIndex: 1, packingSlotName: "AM" });

        movePackingSlot({ rowIndex: 1, direction: "up" });

        assertPackingSlotName({ rowIndex: 0, packingSlotName: "AM" });
        assertPackingSlotName({ rowIndex: 1, packingSlotName: "PM" });
    });
});

function movePackingSlot({
    rowIndex,
    direction,
}: {
    rowIndex: number;
    direction: "up" | "down";
}): void {
    cy.contains(modifyPackingSlotsText, { matchCase: false })
        .parents(".MuiPaper-root")
        .find(`[data-rowindex="${rowIndex}"]`) // eslint-disable-line quotes
        .find(`[data-testid="${direction === "up" ? "ArrowCircleUpIcon" : "ArrowCircleDownIcon"}"]`) // eslint-disable-line quotes
        .click();
}

function assertPackingSlotName({
    rowIndex,
    packingSlotName,
}: {
    rowIndex: number;
    packingSlotName: string;
}): void {
    cy.contains(modifyPackingSlotsText, { matchCase: false })
        .parents(".MuiPaper-root")
        .find(`[data-rowindex="${rowIndex}"]`) // eslint-disable-line quotes
        .find('[data-field="name"]') // eslint-disable-line quotes
        .should(($slotName) => {
            expect($slotName).to.contain(packingSlotName);
        });
}
