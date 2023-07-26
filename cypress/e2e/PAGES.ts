interface Page {
    friendly_name: string;
    url: string;
}

const PAGES: Page[] = [
    { friendly_name: "Clients", url: "/clients" },
    { friendly_name: "Calendar", url: "/calendar" },
    { friendly_name: "Lists", url: "/lists" },
];

export default PAGES;
