import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import StyleManager from "@/app/themes";
import WikiItems from "@/app/info/WikiItems";
import { DbWikiRow } from "@/databaseUtils";
import { expect, it } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { RoleUpdateContext } from "@/app/roles";
import userEvent from "@testing-library/user-event";

const logID = "a2adb0ba-873e-506b-abd1-8cd1782923c8";

jest.mock("@/logger/logger", () => ({
    logErrorReturnLogId: jest.fn(() => Promise.resolve(logID)),
}));

jest.mock("@/server/auditLog", () => ({
    sendAuditLog: jest.fn(),
}));

jest.mock("@/app/info/supabaseCall", () => ({
    reorderSupabaseCall: jest.fn(),
    deleteSupabaseCall: jest.fn(),
    updateSupabaseCall: jest.fn(),
    insertSupabaseCall: jest.fn(() => ({
        data: {
            content: "",
            row_order: 3,
            title: "",
            wiki_key: "9bc00a7c-e552-40e5-889b-e6ae2cb184f1",
        },
        error: null,
    })),
}));

const mRandomUUID = jest.fn().mockReturnValue("058049b5-7a7f-4f81-bf56-6dc9654e5a40");
Object.defineProperty(window, "crypto", {
    value: { randomUUID: mRandomUUID },
});

const mScrollIntoViewMock = jest.fn();
window.HTMLElement.prototype.scrollIntoView = mScrollIntoViewMock;

describe("Wiki items component", () => {
    let mockData: DbWikiRow[];
    beforeEach(() => {
        cleanup();
        jest.spyOn(window, "confirm").mockImplementation(() => true);

        mockData = [
            {
                title: "Test 1",
                content: "Test content 1",
                wiki_key: "058049b5-7a7f-4f81-bf56-6dc9654e5a40",
                row_order: 1,
            },
            {
                title: "Test 2",
                content: "Test content 2",
                wiki_key: "731280a7-eb99-4229-aa49-84dbb112641c",
                row_order: 2,
            },
        ];
    });

    it("renders the add, edit, reorder buttons for admins in display mode", () => {
        render(
            <StyleManager>
                <RoleUpdateContext.Provider value={{ role: "admin", setRole: jest.fn() }}>
                    <WikiItems rows={mockData} />
                </RoleUpdateContext.Provider>
            </StyleManager>
        );
        expect(
            screen.getByRole("button", {
                name: "+ Add",
            })
        );
        expect(screen.getByTestId("#edit-1"));
        expect(screen.getByTestId("#swap-up-1"));
        expect(screen.getByTestId("#swap-down-2"));
    });

    it("has edit button for manager users, and on click, has update and delete buttons", () => {
        render(
            <StyleManager>
                <RoleUpdateContext.Provider value={{ role: "manager", setRole: jest.fn() }}>
                    <WikiItems rows={mockData} />
                </RoleUpdateContext.Provider>
            </StyleManager>
        );
        fireEvent.click(screen.getByTestId("#edit-1"));
        expect(screen.getByTestId("#cancel-1"));
        expect(screen.getByTestId("#update-1"));
        expect(screen.getByTestId("#delete-1"));
        expect(screen.getByTestId("#swap-up-1"));
        expect(screen.getByTestId("#swap-down-1"));
    });

    it("does not render the add, reorder, or edit buttons for volunteers", () => {
        render(
            <StyleManager>
                <RoleUpdateContext.Provider value={{ role: "volunteer", setRole: jest.fn() }}>
                    <WikiItems rows={mockData} />
                </RoleUpdateContext.Provider>
            </StyleManager>
        );
        expect(
            screen.queryByRole("button", {
                name: "+ Add",
            })
        ).toBeNull();
        expect(screen.queryByTestId("#swap-up-1")).toBeNull();
        expect(screen.queryByTestId("#swap-down-2")).toBeNull();
        expect(screen.queryByTestId("#edit-1")).toBeNull();
    });

    it("renders the wiki rows", () => {
        render(
            <StyleManager>
                <RoleUpdateContext.Provider value={{ role: "admin", setRole: jest.fn() }}>
                    <WikiItems rows={mockData} />
                </RoleUpdateContext.Provider>
            </StyleManager>
        );
        expect(screen.getByText("Test 1")).toBeInTheDocument();
        expect(screen.getByText("Test 2")).toBeInTheDocument();
    });

    it("opens a wiki item when clicked", () => {
        render(
            <StyleManager>
                <RoleUpdateContext.Provider value={{ role: "admin", setRole: jest.fn() }}>
                    <WikiItems rows={mockData} />
                </RoleUpdateContext.Provider>
            </StyleManager>
        );
        fireEvent.click(screen.getByText("Test 1"));
        expect(screen.getByText("Test content 1")).toBeInTheDocument();
    });

    it("reorders the wiki items when reorder buttons are clicked in display mode", async () => {
        const user = userEvent.setup();

        render(
            <StyleManager>
                <RoleUpdateContext.Provider value={{ role: "admin", setRole: jest.fn() }}>
                    <WikiItems rows={mockData} />
                </RoleUpdateContext.Provider>
            </StyleManager>
        );
        await user.click(screen.getByTestId("#swap-up-2"));
        expect(mockData[0].row_order).toBe(2);
        expect(mockData[1].row_order).toBe(1);
    });

    it("reorders the wiki items when reorder buttons are clicked in edit mode", async () => {
        const user = userEvent.setup();

        render(
            <StyleManager>
                <RoleUpdateContext.Provider value={{ role: "admin", setRole: jest.fn() }}>
                    <WikiItems rows={mockData} />
                </RoleUpdateContext.Provider>
            </StyleManager>
        );
        await user.click(screen.getByTestId("#edit-2"));
        await user.click(screen.getByTestId("#swap-up-2"));
        expect(mockData[0].row_order).toBe(2);
        expect(mockData[1].row_order).toBe(1);
    });

    it("deletes a wiki item when its delete button is clicked", async () => {
        const user = userEvent.setup();

        render(
            <StyleManager>
                <RoleUpdateContext.Provider value={{ role: "admin", setRole: jest.fn() }}>
                    <WikiItems rows={mockData} />
                </RoleUpdateContext.Provider>
            </StyleManager>
        );
        await user.click(screen.getByTestId("#edit-1"));
        await user.click(screen.getByTestId("#delete-1"));
        expect(screen.queryByText("Test 1")).toBeNull();
    });

    it("edits a wiki item when its edit button is clicked", async () => {
        const user = userEvent.setup();

        render(
            <StyleManager>
                <RoleUpdateContext.Provider value={{ role: "admin", setRole: jest.fn() }}>
                    <WikiItems rows={mockData} />
                </RoleUpdateContext.Provider>
            </StyleManager>
        );
        await user.click(screen.getByTestId("#edit-1"));
        const titleInput = screen.getByTestId("#title-1");
        fireEvent.change(titleInput, { target: { value: "Updated Test 1" } });
        const contentInput = screen.getByTestId("#content-1");
        fireEvent.change(contentInput, { target: { value: "Updated Test content 1" } });
        await user.click(screen.getByTestId("#update-1"));
        expect(screen.queryByText("Test 1")).toBeNull();
        expect(screen.getByText("Updated Test 1")).toBeInTheDocument();
        expect(screen.queryByText("Test content 1")).toBeNull();
        expect(screen.getByText("Updated Test content 1")).toBeInTheDocument();
    });

    it("adds an item when the add button is clicked", async () => {
        const user = userEvent.setup();

        render(
            <StyleManager>
                <RoleUpdateContext.Provider value={{ role: "admin", setRole: jest.fn() }}>
                    <WikiItems rows={mockData} />
                </RoleUpdateContext.Provider>
            </StyleManager>
        );
        await user.click(screen.getByTestId("#add"));
        const titleInput = screen.getByTestId("#title-3");
        fireEvent.change(titleInput, { target: { value: "Added test title" } });
        const contentInput = screen.getByTestId("#content-3");
        fireEvent.change(contentInput, { target: { value: "Added test content" } });
        await user.click(screen.getByTestId("#update-3"));
        expect(screen.getByText("Added test title")).toBeInTheDocument();
        expect(screen.getByText("Added test content")).toBeInTheDocument();
    });

    it("cancels an edit when the cancel button is clicked", async () => {
        const user = userEvent.setup();

        render(
            <StyleManager>
                <RoleUpdateContext.Provider value={{ role: "admin", setRole: jest.fn() }}>
                    <WikiItems rows={mockData} />
                </RoleUpdateContext.Provider>
            </StyleManager>
        );
        await user.click(screen.getByTestId("#edit-1"));
        const titleInput = screen.getByTestId("#title-1");
        fireEvent.change(titleInput, { target: { value: "Updated Test 1" } });
        const contentInput = screen.getByTestId("#content-1");
        fireEvent.change(contentInput, { target: { value: "Updated Test content 1" } });
        await user.click(screen.getByTestId("#cancel-1"));
        expect(screen.queryByText("Updated Test 1")).toBeNull();
        expect(screen.getByText("Test 1")).toBeInTheDocument();
        expect(screen.queryByText("Updated Test content 1")).toBeNull();
        expect(screen.getByText("Test content 1")).toBeInTheDocument();
    });

    it("deletes an empty item when it is saved", async () => {
        const user = userEvent.setup();

        render(
            <StyleManager>
                <RoleUpdateContext.Provider value={{ role: "admin", setRole: jest.fn() }}>
                    <WikiItems rows={mockData} />
                </RoleUpdateContext.Provider>
            </StyleManager>
        );
        await user.click(screen.getByTestId("#add"));
        await user.click(screen.getByTestId("#update-3"));
        expect(screen.queryByTestId("#swap-up-3")).toBeNull();
    });

    it("does not add a second new item if one is already present", async () => {
        const user = userEvent.setup();

        render(
            <StyleManager>
                <RoleUpdateContext.Provider value={{ role: "admin", setRole: jest.fn() }}>
                    <WikiItems rows={mockData} />
                </RoleUpdateContext.Provider>
            </StyleManager>
        );
        await user.click(screen.getByTestId("#add"));
        await user.click(screen.getByTestId("#add"));
        expect(screen.queryByTestId("#swap-up-4")).toBeNull();
    });
});
