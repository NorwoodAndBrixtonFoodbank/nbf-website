describe("Add client form", () => {
    beforeEach(() => {
        cy.login();
        cy.visit("/clients/add");
    });

    it("Add a client with no address", () => {
        toggleNoAddress();
        fillName(fullName);
        fillNumberAdults("1");
        fillNumberChildren("0");
        clickSubmitForm();

        assertAddClientFormSubmittedSuccessfully();
    });

    const fullName = "First Last";
    const noAddressText = "No Address";

    function toggleNoAddress(): void {
        cy.contains(noAddressText, { matchCase: false }).click();
    }

    function fillName(value: string): void {
        fillTextboxWithId("client-full-name", value);
    }

    function fillNumberAdults(value: string): void {
        fillTextboxWithId("client-number-females", value);
    }

    function fillNumberChildren(value: string): void {
        fillTextboxWithId("client-number-children", value);
    }

    function clickSubmitForm(): void {
        cy.contains("Submit").click();
    }

    function assertAddClientFormSubmittedSuccessfully(): void {
        cy.contains("Add Parcel").should("be.visible");
        cy.contains(fullName).should("be.visible");
    }

    function fillTextboxWithId(id: string, value: string): void {
        cy.get(`#${id}`).type(value);
    }
});
