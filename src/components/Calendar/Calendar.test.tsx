import React from "react";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, expect, it } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import StyleManager from "@/app/themes";
import Calendar, { CalendarEvent, CalendarProps } from "@/components/Calendar/Calendar";

const StyledCalendar: React.FC<CalendarProps> = (props) => {
    return (
        <StyleManager>
            <Calendar {...props} />
        </StyleManager>
    );
};

describe("Calendar component", () => {
    const testDate = new Date("2021-04-05");
    const dayAfterTestDate = new Date("2021-04-06");
    dayAfterTestDate.setDate(testDate.getDate() + 1);

    afterEach(() => {
        cleanup();
    });

    const sampleEvents: CalendarEvent[] = [
        {
            id: "a",
            title: "event1",
            start: testDate,
            end: dayAfterTestDate,
            allDay: true,
            location: "Brixton Hill - Methodist Church",
        },
        {
            id: "b",
            title: "event2",
            start: testDate,
            end: testDate,
            allDay: false,
            description: "a piece of description text",
            location: "Brixton Hill - Methodist Church",
        },
    ];

    it("calendar renders", () => {
        render(
            <StyledCalendar initialEvents={[]} allLocations={["Brixton Hill - Methodist Church"]} />
        );
    });

    it("calendar is set to the current month when rendered in dayGridMonth", () => {
        const currentMonthYear = testDate.toLocaleDateString("en-GB", {
            month: "short",
            year: "numeric",
        });

        render(
            <StyledCalendar
                initialEvents={[]}
                initialDate={testDate}
                allLocations={["Brixton Hill - Methodist Church"]}
            />
        );

        expect(screen.getByRole("heading", { name: currentMonthYear })).toBeVisible();
    });

    it("renders events", () => {
        const { container } = render(
            <StyledCalendar
                initialEvents={sampleEvents}
                initialDate={testDate}
                allLocations={["Brixton Hill - Methodist Church"]}
            />
        );

        expect(container.getElementsByClassName("fc-dayGridMonth-view")).toHaveLength(1);
        expect(container.getElementsByClassName("fc-dayGridMonth-view")[0]).toBeVisible();

        expect(within(screen.getByRole("grid")).getByText("event1")).toBeVisible();
        expect(within(screen.getByRole("grid")).getByText("event2")).toBeVisible();
    });

    it("can change view to timeGridDay", () => {
        const { container } = render(
            <StyledCalendar
                initialEvents={[]}
                initialDate={testDate}
                allLocations={["Brixton Hill - Methodist Church"]}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: "day" }));

        expect(container.getElementsByClassName("fc-timeGridDay-view")).toHaveLength(1);
        expect(container.getElementsByClassName("fc-timeGridDay-view")[0]).toBeVisible();
    });

    it("can change view to timeGridWeek", () => {
        const { container } = render(
            <StyledCalendar
                initialEvents={[]}
                initialDate={testDate}
                allLocations={["Brixton Hill - Methodist Church"]}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: "week" }));

        expect(container.getElementsByClassName("fc-timeGridWeek-view")).toHaveLength(1);
        expect(container.getElementsByClassName("fc-timeGridWeek-view")[0]).toBeVisible();
    });

    it("can change view between months in dayGridMonth", () => {
        const prevMonth = new Date(testDate);
        prevMonth.setMonth((testDate.getMonth() + 11) % 12);
        const prevMonthYear = prevMonth.toLocaleString("en-GB", {
            month: "short",
            year: "numeric",
        });

        render(
            <StyledCalendar
                initialEvents={[]}
                initialDate={testDate}
                allLocations={["Brixton Hill - Methodist Church"]}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: "Previous month" }));

        expect(screen.getByRole("heading", { name: prevMonthYear })).toBeVisible();
    });

    it("can change view between days in timeGridDay", () => {
        const tomorrowDMY = dayAfterTestDate
            .toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric" })
            .split(" ");

        render(
            <StyledCalendar
                initialEvents={[]}
                view="timeGridDay"
                initialDate={testDate}
                allLocations={["Brixton Hill - Methodist Church"]}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: "Next day" }));

        expect(
            screen.getByRole("heading", {
                name: `${tomorrowDMY[0]} ${tomorrowDMY[1]} ${tomorrowDMY[2]}`,
            })
        ).toBeVisible();
    });

    it("shows description when event with description is clicked", () => {
        render(
            <StyledCalendar
                initialEvents={sampleEvents}
                initialDate={testDate}
                allLocations={["Brixton Hill - Methodist Church"]}
            />
        );

        fireEvent.click(within(screen.getByRole("grid")).getByText("event2"));

        expect(screen.getByRole("dialog")).toHaveTextContent("a piece of description text");
    });

    it("does not show description when event without description is clicked", () => {
        render(
            <StyledCalendar
                initialEvents={sampleEvents}
                initialDate={testDate}
                allLocations={["Brixton Hill - Methodist Church"]}
            />
        );

        fireEvent.click(within(screen.getByRole("grid")).getByText("event1"));

        expect(screen.getByRole("dialog")).not.toHaveTextContent("description");
    });

    it("shows correct date for full day event", () => {
        render(
            <StyledCalendar
                initialEvents={sampleEvents}
                initialDate={testDate}
                allLocations={["Brixton Hill - Methodist Church"]}
            />
        );

        fireEvent.click(within(screen.getByRole("grid")).getByText("event1"));

        expect(screen.getByRole("dialog")).toHaveTextContent(
            testDate.toLocaleDateString("en-GB", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            })
        );
        expect(screen.getByRole("dialog")).toHaveTextContent(
            dayAfterTestDate.toLocaleDateString("en-GB", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            })
        );
        expect(screen.getByRole("dialog")).not.toHaveTextContent(
            testDate.toLocaleTimeString("en-GB", {
                hour: "numeric",
                minute: "numeric",
            })
        );
        expect(screen.getByRole("dialog")).not.toHaveTextContent(
            dayAfterTestDate.toLocaleTimeString("en-GB", {
                hour: "numeric",
                minute: "numeric",
            })
        );
    });

    it("shows correct date and time for non-full day event", () => {
        render(
            <StyledCalendar
                initialEvents={sampleEvents}
                initialDate={testDate}
                allLocations={["Brixton Hill - Methodist Church"]}
            />
        );

        fireEvent.click(within(screen.getByRole("grid")).getByText("event2"));

        expect(screen.getByRole("dialog")).toHaveTextContent(
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
});
