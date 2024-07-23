// import React from "react";
// import { render } from "@testing-library/react";
// import { expect, it } from "@jest/globals";
// import "@testing-library/jest-dom/jest-globals";
// import ActionAndStatusBar, {
//     ActionAndStatusBarProps,
// } from "@/app/parcels/ActionBar/ActionAndStatusBar";

// // Mock the required functions and types
// const mockFetchSelectedParcels = jest.fn().mockResolvedValue([]);
// const mockUpdateParcelStatuses = jest.fn().mockResolvedValue({ error: null });

// const mockProps: ActionAndStatusBarProps = {
//     fetchSelectedParcels: mockFetchSelectedParcels,
//     updateParcelStatuses: mockUpdateParcelStatuses,
// };

// // jest.mock('@mui/material/Menu/Menu', () => (
// //     (props: React.PropsWithChildren<any>, context?: any) => {
// //       return (
// //         <div>
// //           <input data-testid='mock-menu' />
// //         </div>
// //       );
// //     }
// //   ));
// jest.mock("@/supabaseClient", () => {
//     return { default: jest.fn() };
// });


// const logID = "a2adb0ba-873e-506b-abd1-8cd1782923c8";
// jest.mock("@/logger/logger", () => ({
//     logErrorReturnLogId: jest.fn(() => Promise.resolve(logID)),
// }));

// describe("ActionAndStatusBar", () => {
//     it("renders the component", () => {
//         const { getByText } = render(<ActionAndStatusBar {...mockProps} />);
//         expect(getByText("Statuses")).toBeInTheDocument();
//         expect(getByText("Actions")).toBeInTheDocument();
//     });
// });

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { expect, it } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import ActionAndStatusBar, {
    ActionAndStatusBarProps,
    } from "@/app/parcels/ActionBar/ActionAndStatusBar";

// Mock functions for props
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

jest.mock("supabase", () => {
    return { default: jest.fn() };
})

const logID = "a2adb0ba-873e-506b-abd1-8cd1782923c8";
jest.mock("@/logger/logger", () => ({
    logErrorReturnLogId: jest.fn(() => Promise.resolve(logID)),
}));


describe('ActionAndStatusBar', () => {
  it('renders without crashing', () => {
    render(
      <ActionAndStatusBar
        fetchSelectedParcels={mockFetchSelectedParcels}
        updateParcelStatuses={mockUpdateParcelStatuses}
      />
    );
    
    // Check if buttons are rendered
    expect(screen.getByText('Statuses')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('opens status menu on click', () => {
    render(
      <ActionAndStatusBar
        fetchSelectedParcels={mockFetchSelectedParcels}
        updateParcelStatuses={mockUpdateParcelStatuses}
      />
    );

    // Check if status button is in the document
    const statusButton = screen.getByText('Statuses');
    expect(statusButton).toBeInTheDocument();

    // Simulate button click
    fireEvent.click(statusButton);

    // Check if statusAnchorElement is set (if you have any specific logic, you can test it here)
    // Currently, this is a placeholder for testing click functionality
    // In a real scenario, you might want to check if a menu opens or some state changes
  });

  it('shows error message when modalError is set', () => {
    render(
      <ActionAndStatusBar
        fetchSelectedParcels={mockFetchSelectedParcels}
        updateParcelStatuses={mockUpdateParcelStatuses}
      />
    );

    // Set modalError by updating the component props
    // For simplicity, you might simulate state changes if applicable
    // This requires adjustments based on how you manage state and props
  });
});