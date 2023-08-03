import React from "react";
import StyleManager from "@/app/themes";
import Calendar, { CalendarEvent, CalendarProps } from "@/components/Calendar/Calendar";

const StyledCalendar: React.FC<CalendarProps> = (props) => {
    return (
        <StyleManager>
            <Calendar {...props} />
        </StyleManager>
    );
};

describe("<Calendar />", () => {
    const testDate = new Date("2021-04-05");
    const dayAfterTestDate = new Date("2021-04-06");
    dayAfterTestDate.setDate(testDate.getDate() + 1);

    const sampleEvents: CalendarEvent[] = [
        {
            id: "a",
            title: "event1",
            start: testDate,
            end: dayAfterTestDate,
            allDay: true,
        },
        {
            id: "b",
            title: "event2",
            start: testDate,
            end: testDate,
            allDay: false,
            description: "a piece of description text",
        },
    ];
    it("calendar renders", () => {
        cy.mount(<StyledCalendar initialEvents={[]} />);
    });

    it("calendar is set to the current month when rendered in dayGridMonth", () => {
        const currentMonthYear = testDate.toLocaleDateString("en-GB", {
            month: "short",
            year: "numeric",
        });

        cy.mount(<StyledCalendar initialEvents={[]} initialDate={testDate} />);
        cy.get(".fc-toolbar-title").should("have.text", currentMonthYear);
    });

    it("events render", () => {
        cy.mount(<StyledCalendar initialEvents={sampleEvents} initialDate={testDate} />);
        cy.get(".fc-event").should("be.visible");
    });

    it("can change view to timeGridDay", () => {
        cy.mount(<StyledCalendar initialEvents={[]} initialDate={testDate} />);
        cy.get("button.fc-timeGridDay-button").click();
        cy.get(".fc-timeGridDay-view").should("be.visible");
    });

    it("can change view to timeGridWeek", () => {
        cy.mount(<StyledCalendar initialEvents={[]} initialDate={testDate} />);
        cy.get("button.fc-timeGridWeek-button").click();
        cy.get(".fc-timeGridWeek-view").should("be.visible");
    });

    it("can change view between months in dayGridMonth", () => {
        const prevMonth = new Date(testDate);
        prevMonth.setMonth((testDate.getMonth() + 11) % 12);
        const prevMonthYear = prevMonth.toLocaleString("en-GB", {
            month: "short",
            year: "numeric",
        });

        cy.mount(<StyledCalendar initialEvents={[]} initialDate={testDate} />);
        cy.get("button.fc-prev-button").click();

        cy.get(".fc-toolbar-title").should("have.text", prevMonthYear);
    });

    it("can change view between days in timeGridDay", () => {
        const tomorrowDMY = dayAfterTestDate
            .toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric" })
            .split(" ");

        cy.mount(<StyledCalendar initialEvents={[]} view="timeGridDay" initialDate={testDate} />);
        cy.get("button.fc-next-button").click();

        cy.get(".fc-toolbar-title").should(
            "have.text",
            `${tomorrowDMY[1]} ${tomorrowDMY[0]}, ${tomorrowDMY[2]}`
        );
    });

    it("shows description when event with description is clicked", () => {
        cy.mount(<StyledCalendar initialEvents={sampleEvents} initialDate={testDate} />);
        cy.get(".fc-event-title").contains("event2").parent().click();
        cy.get(".MuiDialog-container").should("include.text", "a piece of description text");
    });

    it("does not show description when event without description is clicked", () => {
        cy.mount(<StyledCalendar initialEvents={sampleEvents} initialDate={testDate} />);
        cy.get(".fc-event-title").contains("event1").click();
        cy.get(".MuiDialog-container").should("not.include.text", "description");
    });

    it("shows correct date for full day event", () => {
        cy.mount(<StyledCalendar initialEvents={sampleEvents} initialDate={testDate} />);
        cy.get(".fc-event-title").contains("event1").click();
        cy.get(".MuiDialog-container").should(
            "include.text",
            testDate.toLocaleDateString("en-GB", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            })
        );
        cy.get(".MuiDialog-container").should(
            "include.text",
            dayAfterTestDate.toLocaleDateString("en-GB", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            })
        );
        cy.get(".MuiDialog-container").should(
            "not.include.text",
            testDate.toLocaleTimeString("en-GB", {
                hour: "numeric",
                minute: "numeric",
            })
        );
        cy.get(".MuiDialog-container").should(
            "not.include.text",
            dayAfterTestDate.toLocaleTimeString("en-GB", {
                hour: "numeric",
                minute: "numeric",
            })
        );
    });

    it("shows correct date for non-full day event", () => {
        cy.mount(<StyledCalendar initialEvents={sampleEvents} initialDate={testDate} />);
        cy.get(".fc-event-title").contains("event2").parent().click();
        cy.get(".MuiDialog-container").should(
            "include.text",
            testDate.toLocaleDateString("en-GB", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
            })
        );
    });
    it("navigates to day when grid is clicked", () => {
        cy.mount(<StyledCalendar initialEvents={sampleEvents} initialDate={testDate} />);
        cy.get(".fc-event-title")
            .contains("event2")
            .parent()
            .parent()
            .parent()
            .siblings(".fc-daygrid-day-top")
            .click();
        cy.get(".fc-timeGridDay-view").should("be.visible");
        cy.get(".fc-toolbar-title").should(
            "have.text",
            testDate.toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
            })
        );
    });
});
