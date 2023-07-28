interface Page {
    friendly_name: string;
    url: string;
    requiresLogin: boolean;
}

const PAGES: Page[] = [
    {
        friendly_name: "Clients",
        url: "/clients",
        requiresLogin: true
    },
    {
        friendly_name: "Calendar",
        url: "/calendar",
        requiresLogin: true
    },
    {
        friendly_name: "Lists",
        url: "/lists",
        requiresLogin: true
    },
    {
        friendly_name: "Login",
        url: "/login",
        requiresLogin: false
    }
];

export default PAGES;
