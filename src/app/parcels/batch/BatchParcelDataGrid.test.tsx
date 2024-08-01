import BatchParcelDataGrid from "@/app/parcels/batch/BatchParcelDataGrid";
import React from "react";
import { render, screen } from "@testing-library/react";
import { expect, it } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";

describe("Parcels - Batch Parcel Data Grid", () => {
    beforeEach(() => {
        render(<BatchParcelDataGrid />);
    });
    it("renders intial header view", () => {
        expect(screen.getByText("Full Name")).toBeInTheDocument();
        expect(screen.getByText("Phone Number")).toBeInTheDocument();
    });
});
