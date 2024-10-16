import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import DataViewer, {
    DataViewerProps,
    convertDataToDataForDataViewer,
} from "@/components/DataViewer/DataViewer";
import StyleManager from "@/app/themes";

const longString = "abcdefghijklmnopqrstuvwxyz".repeat(20);
const longName = `John With A ${"Very ".repeat(20)}Long Name`;

const data = {
    id: longString,
    fullName: longName,
    phoneNumber: 1234567,
    dietaryRequirements: null,
};

const dataForDataViewer = convertDataToDataForDataViewer(data);

const StyledDataViewer: React.FC<DataViewerProps> = (props) => {
    return (
        <StyleManager>
            <DataViewer {...props} />
        </StyleManager>
    );
};

describe("Data Viewer Component", () => {
    afterEach(() => {
        cleanup();
    });

    it("renders", () => {
        render(<StyledDataViewer data={dataForDataViewer} />);
    });

    it("shows expected values", () => {
        render(<StyledDataViewer data={dataForDataViewer} />);

        expect(screen.getByText("ID")).toBeVisible();
        expect(screen.getByText(longString)).toBeVisible();
        expect(screen.getByText("FULL NAME")).toBeVisible();
        expect(screen.getByText(longName)).toBeVisible();
        expect(screen.getByText("PHONE NUMBER")).toBeVisible();
        expect(screen.getByText("1234567")).toBeVisible();
        expect(screen.getByText("DIETARY REQUIREMENTS")).toBeVisible();
    });
});
