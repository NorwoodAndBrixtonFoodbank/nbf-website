import React from "react";
import Calendar, { CalendarEvent } from "@/components/Calendar/Calendar";

describe.only("<Calendar />", () => {
    const today = new Date("2021-04-05");
    const tomorrow = new Date("2021-04-06");
    tomorrow.setDate(today.getDate() + 1);

    const sampleEvents: CalendarEvent[] = [
        {
            id: "a",
            title: "event1",
            start: today,
            end: tomorrow,
            allDay: true,
        },
        {
            id: "b",
            title: "event2",
            start: today,
            end: today,
            allDay: false,
            description: "a piece of description text",
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

        cy.mount(<Calendar initialEvents={[]} initialDate={today} />);
        cy.get(".fc-toolbar-title").should("have.text", currentMonthYear);
    });

    it("events render", () => {
        cy.mount(<Calendar initialEvents={sampleEvents} initialDate={today} />);
        cy.get(".fc-event").should("be.visible");
    });

    it("can change view to timeGridDay", () => {
        cy.mount(<Calendar initialEvents={[]} initialDate={today} />);
        cy.get("button.fc-timeGridDay-button").click();
        cy.get(".fc-timeGridDay-view").should("be.visible");
    });

    it("can change view to timeGridWeek", () => {
        cy.mount(<Calendar initialEvents={[]} initialDate={today} />);
        cy.get("button.fc-timeGridWeek-button").click();
        cy.get(".fc-timeGridWeek-view").should("be.visible");
    });

    it("can change view between months in dayGridMonth", () => {
        const prevMonth: Date = new Date(today);
        prevMonth.setMonth((today.getMonth() + 11) % 12);
        const prevMonthYear = prevMonth.toLocaleString("en-GB", { month: "long", year: "numeric" });

        cy.mount(<Calendar initialEvents={[]} initialDate={today} />);
        cy.get("button.fc-prev-button").click();

        cy.get(".fc-toolbar-title").should("have.text", prevMonthYear);
    });

    it("can change view between days in timeGridDay", () => {
        const tomorrowDMY = tomorrow
            .toLocaleString("en-GB", { day: "numeric", month: "long", year: "numeric" })
            .split(" ");

        cy.mount(<Calendar initialEvents={[]} view="timeGridDay" initialDate={today} />);
        cy.get("button.fc-next-button").click();

        cy.get(".fc-toolbar-title").should(
            "have.text",
            `${tomorrowDMY[1]} ${tomorrowDMY[0]}, ${tomorrowDMY[2]}`
        );
    });

    it("shows description when event with description is clicked", () => {
        cy.mount(<Calendar initialEvents={sampleEvents} initialDate={today} />);
        cy.get(".fc-event-title").contains("event2").parent().click();
        cy.get(".MuiDialog-container").should("include.text", "a piece of description text");
    });

    it("does not show description when event without description is clicked", () => {
        cy.mount(<Calendar initialEvents={sampleEvents} initialDate={today} />);
        cy.get(".fc-event-title").contains("event1").click();
        cy.get(".MuiDialog-container").should("not.include.text", "description");
    });

    it("shows correct date for full day event", () => {
        cy.mount(<Calendar initialEvents={sampleEvents} initialDate={today} />);
        cy.get(".fc-event-title").contains("event1").click();
        cy.get(".MuiDialog-container").should(
            "include.text",
            today.toLocaleDateString("en-GB", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            })
        );
        cy.get(".MuiDialog-container").should(
            "include.text",
            tomorrow.toLocaleDateString("en-GB", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            })
        );
        cy.get(".MuiDialog-container").should(
            "not.include.text",
            today.toLocaleTimeString("en-GB", {
                hour: "numeric",
                minute: "numeric",
            })
        );
        cy.get(".MuiDialog-container").should(
            "not.include.text",
            tomorrow.toLocaleTimeString("en-GB", {
                hour: "numeric",
                minute: "numeric",
            })
        );
    });

    it("shows correct date for non-full day event", () => {
        cy.mount(<Calendar initialEvents={sampleEvents} initialDate={today} />);
        cy.get(".fc-event-title").contains("event2").parent().click();
        cy.get(".MuiDialog-container").should(
            "include.text",
            today.toLocaleDateString("en-GB", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
            })
        );
    });
});
