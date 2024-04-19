import { v4 as uuidv4 } from "uuid";

describe("User invite on admins page", () => {
    beforeEach(() => {
        cy.login();
        cy.visit("/admin");
    });

    it("Invite a user without a phone number", () => {
        const email = generateRandomEmailAddress();
        
        toggleCreateUserSection();
        fillEmail(email);
        fillFirstName("First");
        fillLastName("Last");
        clickInviteUser();

        assertUserInvitedSuccessfully(email);
    });

    it("Invite a user without a phone number after typing a number first", () => {
        const email = generateRandomEmailAddress();

        toggleCreateUserSection();
        fillEmail(email);
        fillFirstName("First");
        fillLastName("Last");
        fillPhoneNumber("00000000000");
        clearPhoneNumber();
        clickInviteUser();

        assertUserInvitedSuccessfully(email);
    });

    it("Invite a user with a phone number", () => {
        const email = generateRandomEmailAddress();

        toggleCreateUserSection();
        fillEmail(email);
        fillFirstName("First");
        fillLastName("Last");
        fillPhoneNumber("00000000000");
        clickInviteUser();

        assertUserInvitedSuccessfully(email);
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

    function assertUserInvitedSuccessfully(email: string): void {
        cy.contains(`User ${email} invited successfully.`).should("be.visible");
    }

    function generateRandomEmailAddress(): string {
        return `${uuidv4()}@example.com`;
    }
});
