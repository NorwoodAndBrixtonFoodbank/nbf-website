import React from "react";
import Calendar, { CalendarEvent } from "./Calendar";

describe("<CalendarComponent />", () => {
    const today: Date = new Date();

    const sampleEvents: CalendarEvent[] = [
        {
            id: "a",
            title: "event1",
            start: new Date("2023-07-11"),
            end: new Date("2023-07-12"),
        },
        {
            id: "b",
            title: "event2",
            start: new Date("2023-07-12"),
            end: new Date("2023-07-13"),
        },
    ];

    it("calendar renders", () => {
        cy.mount(<Calendar initialEvents={[]} />);
    });

    it("calendar is set to the current month when rendered in dayGridMonth", () => {
        const currentMonthYear = today.toLocaleDateString("en-GB", {
            month: "long",
            year: "numeric",
        });

        cy.mount(<Calendar initialEvents={[]} />);
        cy.get(".fc-toolbar-title").should("have.text", currentMonthYear);
    });

    it("events render", () => {
        cy.mount(<Calendar initialEvents={sampleEvents} />);
    });

    it("can change view to timeGridDay", () => {
        cy.mount(<Calendar initialEvents={[]} />);
        cy.get("button.fc-timeGridDay-button").click();
        cy.get(".fc-timeGridDay-view").should("be.visible");
    });

    it("can change view to timeGridWeek", () => {
        cy.mount(<Calendar initialEvents={[]} />);
        cy.get("button.fc-timeGridWeek-button").click();
        cy.get(".fc-timeGridWeek-view").should("be.visible");
    });

    it("can change view between months in dayGridMonth", () => {
        const prevMonth: Date = new Date(today.getTime());
        prevMonth.setMonth((today.getMonth() + 11) % 12);
        const prevMonthYear = prevMonth.toLocaleString("en-GB", { month: "long", year: "numeric" });

        cy.mount(<Calendar initialEvents={[]} />);
        cy.get("button.fc-prev-button").click();

        cy.get(".fc-toolbar-title").should("have.text", prevMonthYear);
    });

    it("can change view between days in timeGridDay", () => {
        const yesterday: Date = new Date(today.getTime());
        yesterday.setDate(today.getDate() + 1);
        const yesterdayDMY = yesterday
            .toLocaleString("en-GB", { day: "numeric", month: "long", year: "numeric" })
            .split(" ");

        cy.mount(<Calendar initialEvents={[]} view="timeGridDay" />);
        cy.get("button.fc-next-button").click();

        cy.get(".fc-toolbar-title").should(
            "have.text",
            `${yesterdayDMY[1]} ${yesterdayDMY[0]}, ${yesterdayDMY[2]}`
        );
    });

    it("shows description when event is clicked", () => {
        cy.mount(<Calendar initialEvents={sampleEvents} />);
        cy.get(".fc-event-title").first().click();
        cy.get(".MuiDialog-container").should("be.visible");
    });
});
