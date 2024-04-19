describe("User invite on admins page", () => {
    beforeEach(() => {
        cy.login();
        cy.visit("/admin");
    });

    it("Invite a user without a phone number", () => {
        const email = "new-user-without-phone-number@emxaple.com";
        toggleCreateUserSection();
        fillEmail(email);
        fillFirstName("First");
        fillLastName("Last");
        clickInviteUser();
        cy.contains("Failed to create a profile for the new user.").should("be.visible");
    });

    it("Invite a user without a phone number after typing a number first", () => {
        // open the invite user section
        const email = "new-user-without-phone-number-after-filling-in@emxaple.com";
        toggleCreateUserSection();
        fillEmail(email);
        fillFirstName("First");
        fillLastName("Last");
        fillPhoneNumber("00000000000");
        clearPhoneNumber();
        clickInviteUser();
    });

    it("Invite a user with a phone number", () => {
        // open the invite user section
        const email = "new-user-with-phone-number@emxaple.com";
        toggleCreateUserSection();
        fillEmail(email);
        fillFirstName("First");
        fillLastName("Last");
        fillPhoneNumber("00000000000");
        clickInviteUser();

        cy.contains(`User ${email} invited successfully.`).should("be.visible");
    });

    const createUserText = "create user";

    function toggleCreateUserSection(): void {
        cy.contains(createUserText, { matchCase: false }).click();
    }

    function fillEmail(value: string): void {
        fillTextboxWithId("new-user-email-address", value);
    }

    function fillFirstName(value: string): void {
        fillTextboxWithId("new-user-first-name", value);
    }

    function fillLastName(value: string): void {
        fillTextboxWithId("new-user-last-name", value);
    }

    function fillPhoneNumber(value: string): void {
        fillTextboxWithId("new-user-phone-number", value);
    }

    function clearPhoneNumber(): void {
        cy.get("#new-user-phone-number").clear();
    }

    function fillTextboxWithId(id: string, value: string): void {
        cy.get(`#${id}`).type(value);
    }

    function clickInviteUser(): void {
        cy.contains("Invite User").click();
    }
});
