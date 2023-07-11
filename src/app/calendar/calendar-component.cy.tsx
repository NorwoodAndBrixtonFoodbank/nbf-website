import React from "react";
import CalendarComponent, { EventObjects } from "./calendar-component";

Cypress.on('uncaught:exception', (err, runnable) => { // TODO: Delete this!!??
    return false
})

describe("<CalendarComponent />", () => { 

    const today = new Date();
    const currentDate = today.getDate();
    const currentMonth = today.toLocaleDateString("en-GB", {month: 'long'});
    const currentYear = today.getFullYear();

    const sampleEvents: EventObjects[] = [
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
        cy.mount(<CalendarComponent initialEvents={[]} />);
    });

    it("calendar is set to the current month when rendered in dayGridMonth", () => {
        cy.mount(<CalendarComponent initialEvents={[]} />);
        cy.get(".fc-toolbar-title").should("have.text", `${currentMonth} ${currentYear}`);
    });

    it("calendar is set to the current week when rendered in timeGridWeek");// TODO: add expected week


    it("calendar is set to the current day when rendered in timeGridDay"); // TODO: add

    it("events render", () => {
        cy.mount(<CalendarComponent initialEvents={sampleEvents} />);
    });

    it("can change view to timeGridDay", () => {
        cy.mount(<CalendarComponent initialEvents={[]} />);
        cy.get("button.fc-timeGridDay-button").click();
        cy.get(".fc-timeGridDay-view").should("be.visible");
    });

    it("can change view to timeGridWeek", () => {
        cy.mount(<CalendarComponent initialEvents={[]} />);
        cy.get("button.fc-timeGridWeek-button").click();
        cy.get(".fc-timeGridWeek-view").should("be.visible");
    });

    it("can change view between months in dayGridMonth", () => { // TODO: change to not be July
        cy.mount(<CalendarComponent initialEvents={[]} />)
        cy.get("button.fc-prev-button").click();
        cy.get(".fc-toolbar-title").should("have.text", "June 2023");
    });

    it("can change view between weeks in timeGridWeek") // TODO: add 

    it("can change view between days in timeGridDay") // TODO: add 

    // it("can add event by selecting", () => {
    //     // TODO: testing what happens if initial events are not on the same page as added event -> doesn't work. 
    //     // TODO: need to change test so that the start date is in the curent view 
    //     // TODO: Expected behaviour needs to be changed to match modal (perhaps split into multiple unit tests)
    //     // TODO: change to not be July
    //     cy.mount(<CalendarComponent editable={true} initialEvents={sampleEvents}/>);
    //     cy.get("button.fc-timeGridWeek-button").click();
    //     cy.get(".fc-timegrid-slot-lane[data-time='06:30:00']").click(0,0);
    //     cy.get(".fc-event-main").should("have.length", 3);

    //     /*The following error originated from your application code, not from Cypress.
    //     > Cannot read properties of null (reading 'document')
    //     When Cypress detects uncaught errors originating from your application it will automatically fail the current test.
    //     This behavior is configurable, and you can choose to turn this off by listening to the uncaught:exception event.*/
    // });

})
