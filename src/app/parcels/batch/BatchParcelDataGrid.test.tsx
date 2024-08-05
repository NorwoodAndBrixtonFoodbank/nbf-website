import BatchParcelDataGrid from "@/app/parcels/batch/BatchParcelDataGrid";
import React from "react";
import { expect, it } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import renderer from "react-test-renderer";
import mockData from "./mockData";

describe("Data Grid Snapshot Test", () => {
    it("Matches DOM Snapshot", () => {
        const domTree = renderer
            .create(<BatchParcelDataGrid rows={mockData} />)
            .toJSON() as renderer.ReactTestRendererJSON;
        expect(domTree).toMatchSnapshot();
    });
});

export default mockData;
