import React from "react";
import Calendar, { CalendarEvent } from "./Calendar";

describe("<CalendarComponent />", () => {
    let today: Date;
    let currentMonth: string;
    let currentYear: number;

    beforeEach(() => {
        today = new Date();
        currentMonth = today.toLocaleDateString("en-GB", { month: "long" });
        currentYear = today.getFullYear();
    });

    const sampleEvents: CalendarEvent[] = [
        {
            id: "a",
            title: "event1",
            start: new Date("2023-07-11"),
        },
        {
            id: "b",
            title: "event2",
            start: new Date("2023-07-12"),
        },
    ];

    it("calendar renders", () => {
        cy.mount(<Calendar initialEvents={[]} />);
    });

    it("calendar is set to the current month when rendered in dayGridMonth", () => {
        cy.mount(<Calendar initialEvents={[]} />);
        cy.get(".fc-toolbar-title").should("have.text", `${currentMonth} ${currentYear}`);
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
        cy.mount(<Calendar initialEvents={[]} />);
        cy.get("button.fc-prev-button").click();

        today.setMonth(today.getMonth() + 11);

        cy.get(".fc-toolbar-title").should(
            "have.text",
            `${today.toLocaleString("en-GB", { month: "long" })} ${currentYear}`
        );
    });

    it("can change view between days in timeGridDay", () => {
        cy.mount(<Calendar initialEvents={[]} view="timeGridDay" />);
        cy.get("button.fc-next-button").click();

        today.setDate(today.getDate() + 1);

        cy.get(".fc-toolbar-title").should(
            "have.text",
            `${today.toLocaleString("en-GB", { month: "long" })} ${today.toLocaleString("en-GB", {
                day: "numeric",
            })}, ${currentYear}`
        );
    });

    it("shows description when event is clicked", () => {
        cy.mount(<Calendar initialEvents={sampleEvents} />);
        cy.get(".fc-event-title").first().click();
        cy.get(".MuiDialog-container").should("be.visible");
    });
});
