interface Page {
    friendly_name: string;
    url: string;
    requiresLogin: boolean;
    waitForLoad: () => void;
}

const PAGES: Page[] = [
    {
        friendly_name: "Clients",
        url: "/clients",
        requiresLogin: true,
        waitForLoad: () => {},
    },
    {
        friendly_name: "Calendar",
        url: "/calendar",
        requiresLogin: true,
        waitForLoad: () => cy.get("table").should("be.visible"),
    },
    {
        friendly_name: "Lists",
        url: "/lists",
        requiresLogin: true,
        waitForLoad: () => cy.get("div[role='table']").should("be.visible"),
    },
    {
        friendly_name: "Login",
        url: "/login",
        requiresLogin: false,
        waitForLoad: () => cy.get("[data-loaded='true']", { timeout: 10000 }).should("exist"),
    },
];

export default PAGES;
