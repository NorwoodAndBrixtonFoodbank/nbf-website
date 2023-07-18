import React from "react";
import Table from "@/components/Tables/Table";

describe("<Table />", () => {
    const data = [
        {
            full_name: "Tom",
            phone_number: 123456,
        },
        {
            full_name: "Sam",
            phone_number: 999,
        },
        {
            full_name: "Harper Garrett",
            phone_number: 2171786554,
        },
        {
            full_name: "Adrian Key",
            phone_number: 3650099130,
        },
        {
            full_name: "Harrell Wallace",
            phone_number: 4650047935,
        },
        {
            full_name: "Oneill Curtis",
            phone_number: 7058491995,
        },
        {
            full_name: "Herring Rutledge",
            phone_number: 1440882899,
        },
        {
            full_name: "Eloise Rowland",
            phone_number: 2580325390,
        },
        {
            full_name: "Cathryn Burks",
            phone_number: 7136166489,
        },
        {
            full_name: "Paopao",
            phone_number: 7136166469,
        },
        {
            full_name: "Forbes Doyle",
            phone_number: 1377097191,
        },
        {
            full_name: "Agnes Rosales",
            phone_number: 3334796379,
        },
        {
            full_name: "Jan Orr",
            phone_number: 1526538148,
        },
        {
            full_name: "Colleen Lowery",
            phone_number: 3980156139,
        },
        {
            full_name: "Chloe",
            phone_number: 4567894522,
        },
    ];

    const smallerData = data.slice(0, 3);

    const headers = {
        full_name: "Name",
        phone_number: "Phone Number",
    };

    it("renders", () => {
        cy.mount(<Table data={data} headers={headers} />);
    });

    it("can display data", () => {
        cy.mount(<Table data={data} headers={headers} />);
        cy.contains("Tom");
        cy.contains("Sam");
        cy.contains("123456");
        cy.contains("999");
    });

    it("filter is correct", () => {
        cy.mount(<Table data={data} headers={headers} />);
        cy.get("input[placeholder='Filter by Name']").type("Tom");
        cy.contains("Tom");
        cy.should("not.have.value", "Sam");
    });

    it("sorting is correct", () => {
        cy.mount(<Table data={data} headers={headers} />);
        cy.get("div").contains("Name").parent().click();
        cy.get("div[data-column-id='2'][role='cell']").as("table");
        cy.get("@table").eq(0).contains("Adrian Key");
        cy.get("@table").eq(1).contains("Agnes Rosales");
        cy.get("div").contains("Name").parent().click();
        cy.get("@table").eq(0).contains("Tom");
        cy.get("@table").eq(1).contains("Sam");
    });

    it("clear button is working", () => {
        cy.mount(<Table data={data} headers={headers} />);
        cy.get("input[placeholder='Filter by Name']").type("Tom");
        cy.get("button").contains("Clear").click();
        cy.contains("Sam");
        cy.get("input[placeholder='Filter by Name']").should("have.value", "");
    });

    it("pagination page change is working", () => {
        cy.mount(<Table data={data} headers={headers} />);
        cy.get("div[data-column-id='2'][role='cell']").as("table");
        cy.get("@table").eq(0).contains("Tom");
        cy.get("button[id='pagination-next-page']").click();
        cy.get("@table").eq(0).contains("Forbes Doyle");
    });

    it("pagination number of items is working", () => {
        cy.mount(<Table data={data} headers={headers} />);
        cy.get("select[aria-label='Rows per page:']").select("15");
        cy.get("div[data-column-id='2'][role='cell']").as("table");
        cy.get("@table").eq(14).contains("Chloe");
        cy.get("@table").eq(15).should("not.exist");
    });

    it("checkbox select toggles", () => {
        cy.mount(<Table data={data} headers={headers} />);
        cy.get("input[aria-label='Select row 0']").should("not.be.checked");
        cy.get("input[aria-label='Select row 0']").click();
        cy.get("input[aria-label='Select row 0']").should("be.checked");
        cy.get("input[aria-label='Select row 0']").click();
        cy.get("input[aria-label='Select row 0']").should("not.be.checked");
    });

    it("checkbox toggles only the selected one", () => {
        cy.mount(<Table data={data} headers={headers} />);
        cy.get("input[aria-label='Select row 0']").should("not.be.checked");
        cy.get("input[aria-label='Select row 2']").click();
        cy.get("input[aria-label='Select row 0']").click();

        cy.get("input[aria-label='Select row 0']").should("be.checked");
        cy.get("input[aria-label='Select row 1']").should("not.be.checked");
        cy.get("input[aria-label='Select row 2']").should("be.checked");

        cy.get("input[aria-label='Select row 0']").click();
        cy.get("input[aria-label='Select row 0']").should("not.be.checked");
        cy.get("input[aria-label='Select row 1']").should("not.be.checked");
        cy.get("input[aria-label='Select row 2']").should("be.checked");
    });

    it("filtering does not affect checkbox", () => {
        cy.mount(<Table data={data} headers={headers} />);
        cy.get("input[aria-label='Select row 0']").should("not.be.checked");
        cy.get("input[aria-label='Select row 0']").click();
        cy.get("input[placeholder='Filter by Name']").type("Sam");
        cy.get("input[placeholder='Filter by Name']").clear();
        cy.get("input[aria-label='Select row 0']").should("be.checked");
    });

    it("changing page does not affect checkbox", () => {
        cy.mount(<Table data={data} headers={headers} />);
        cy.get("input[aria-label='Select row 0']").should("not.be.checked");
        cy.get("input[aria-label='Select row 0']").click();
        cy.get("button[id='pagination-next-page']").click();
        cy.get("button[id='pagination-previous-page']").click();
        cy.get("input[aria-label='Select row 0']").should("be.checked");
    });

    it("pagination limit does not affect checkbox", () => {
        cy.mount(<Table data={data} headers={headers} />);
        cy.get("select[aria-label='Rows per page:']").select("15");
        cy.get("input[aria-label='Select row 14']").should("not.be.checked");

        cy.get("input[aria-label='Select row 14']").click();
        cy.get("input[aria-label='Select row 14']").should("be.checked");

        cy.get("input[aria-label='Select row 0']").click();
        cy.get("input[aria-label='Select row 0']").should("be.checked");

        cy.get("select[aria-label='Rows per page:']").select("10");
        cy.get("input[aria-label='Select row 0']").should("be.checked");
        cy.get("select[aria-label='Rows per page:']").select("15");

        cy.get("input[aria-label='Select row 0']").should("be.checked");
        cy.get("input[aria-label='Select row 14']").should("be.checked");
    });

    it("sorting does not affect checkbox", () => {
        cy.mount(<Table data={data} headers={headers} />);

        cy.get("input[aria-label='Select row 0']").click();
        cy.get("input[aria-label='Select row 0']").should("be.checked");

        cy.get("input[aria-label='Select row 2']").click();
        cy.get("input[aria-label='Select row 2']").should("be.checked");

        cy.get("div").contains("Name").parent().click();
        cy.get("input[aria-label='Select row 2']").should("be.checked");
        cy.get("div").contains("Name").parent().click();

        cy.get("input[aria-label='Select row 0']").should("be.checked");
        cy.get("input[aria-label='Select row 2']").should("be.checked");
    });

    it("checkall box toggles all data", () => {
        cy.mount(<Table data={smallerData} headers={headers} />);
        cy.get("input[aria-label='Select all rows']").click();
        cy.get("input[aria-label='Select row 0']").should("be.checked");
        cy.get("input[aria-label='Select row 1']").should("be.checked");
        cy.get("input[aria-label='Select row 2']").should("be.checked");
    });

    it("uncheck one row unticks the checkall box", () => {
        cy.mount(<Table data={smallerData} headers={headers} />);
        cy.get("input[aria-label='Select all rows']").click();
        cy.get("input[aria-label='Select row 0']").click();

        cy.get("input[aria-label='Select row 0']").should("not.be.checked");
        cy.get("input[aria-label='Select row 1']").should("be.checked");
        cy.get("input[aria-label='Select row 2']").should("be.checked");
        cy.get("input[aria-label='Select all rows']").should("not.be.checked");
    });

    it("check all rows ticks the checkall box", () => {
        cy.mount(<Table data={smallerData} headers={headers} />);
        cy.get("input[aria-label='Select row 0']").click();
        cy.get("input[aria-label='Select row 1']").click();
        cy.get("input[aria-label='Select row 2']").click();

        cy.get("input[aria-label='Select all rows']").should("be.checked");
    });
});
