import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import {expect, it} from "@jest/globals";
import '@testing-library/jest-dom/jest-globals'
import ActionAndStatusBar, {ActionAndStatusBarProps} from "@/app/parcels/ActionBar/ActionAndStatusBar";


// Mock the required functions and types
const mockFetchSelectedParcels = jest.fn().mockResolvedValue([]);
const mockUpdateParcelStatuses = jest.fn().mockResolvedValue({ error: null });

const mockProps: ActionAndStatusBarProps = {
    fetchSelectedParcels: mockFetchSelectedParcels,
    updateParcelStatuses: mockUpdateParcelStatuses,
};

// jest.mock('@mui/material/Menu/Menu', () => (
//     (props: React.PropsWithChildren<any>, context?: any) => {
//       return (
//         <div>
//           <input data-testid='mock-menu' />
//         </div>
//       );
//     }
//   ));
jest.mock("@/supabaseClient", () => {
    return { default: jest.fn() };
});

describe("ActionAndStatusBar", () => {
    it("renders the component", () => {
        const { getByText } = render(<ActionAndStatusBar {...mockProps} />);
        expect(getByText("Statuses")).toBeInTheDocument();
        expect(getByText("Actions")).toBeInTheDocument();
    });

});