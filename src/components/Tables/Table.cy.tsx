import React from "react";
import Table from "./Table";

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
});
