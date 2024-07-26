import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { expect, it } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import ActionAndStatusBar, {
    ActionAndStatusBarProps,
} from "@/app/parcels/ActionBar/ActionAndStatusBar";
import { ParcelsTableRow } from "../parcelsTable/types";
import StyleManager from "@/app/themes";
import Localization from "@/app/Localization";
import { SaveParcelStatusResult } from "./Statuses";

jest.mock("@/supabaseClient", () => {
    return { default: jest.fn() };
});

const logID = "a2adb0ba-873e-506b-abd1-8cd1782923c8";
jest.mock("@/logger/logger", () => ({
    logErrorReturnLogId: jest.fn(() => Promise.resolve(logID)),
}));

jest.mock("@/app/parcels/ActionBar/Statuses", () => {
    return jest.fn().mockImplementation(() => (
        <div>
            <button data-testid="#status-button">Statuses</button>
            <div data-testid="#status-menu">
                <button>Parcel Denied</button>
                {/* Add more status options as needed */}
            </div>
        </div>
    ));
});

jest.mock("@/app/parcels/ActionBar/Actions", () => {
    return jest.fn().mockImplementation(() => (
        <div>
            <button data-testid="#action-button">Actions</button>
            <div data-testid="#action-menu">
                <button>Download Shopping List</button>
                {/* Add more status options as needed */}
            </div>
        </div>
    ));
});

Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

export const MockActionBar: React.FC<ActionAndStatusBarProps> = ({
    fetchSelectedParcels: fetchSelectedParcels,
    updateParcelStatuses: onDeleteParcels,
}) => {
    return (
        <Localization>
            <StyleManager>
                <ActionAndStatusBar
                    fetchSelectedParcels={fetchSelectedParcels}
                    updateParcelStatuses={onDeleteParcels}
                />
            </StyleManager>
        </Localization>
    );
};

export const mockData: ParcelsTableRow[] = [
    {
        clientId: "primaryKey1",
        addressPostcode: "AB1 2CD",
        phoneNumber: "0987 654321",
        deliveryCollection: {
            collectionCentreName: "Centre 1",
            collectionCentreAcronym: "C1",
            congestionChargeApplies: false,
        },
        collectionDatetime: new Date(),
        familyCategory: "Single",
        fullName: "John Smith",
        lastStatus: {
            name: "Delivered",
            eventData: "Some information",
            timestamp: new Date(),
            workflowOrder: 1,
        },
        packingDate: new Date(),
        packingSlot: "AM",
        parcelId: "123456789",
        iconsColumn: {
            requiresFollowUpPhoneCall: false,
            flaggedForAttention: false,
        },
        voucherNumber: "123456789",
        createdAt: new Date("2023-12-31T12:00:00+00:00"),
        clientIsActive: true,
    },
    {
        clientId: "primaryKey2",
        addressPostcode: "AB1 aaaa2CD",
        phoneNumber: "+1 234 567",
        deliveryCollection: {
            collectionCentreName: "Centraaaae 1",
            collectionCentreAcronym: "C2",
            congestionChargeApplies: true,
        },
        collectionDatetime: new Date(),
        familyCategory: "Family of 4",
        fullName: "John Smaaaaith",
        lastStatus: {
            name: "Called and Confirmed",
            eventData: null,
            timestamp: new Date(),
            workflowOrder: 2,
        },
        packingDate: new Date(),
        packingSlot: "PM",
        parcelId: "123456aaaa789",
        iconsColumn: {
            requiresFollowUpPhoneCall: false,
            flaggedForAttention: false,
        },
        voucherNumber: "123456aaaa789",
        createdAt: new Date("2023-12-31T12:00:00+00:00"),
        clientIsActive: true,
    },
];

describe("Parcels - Action Bar", () => {
    let parcelIds: string[] = ["123456789", "123456aaaa789"];
    const onDeleteParcels = async (): Promise<SaveParcelStatusResult> => {
        parcelIds = [];
        return { error: null };
    };

    beforeEach(() => {
        render(
            <MockActionBar
                fetchSelectedParcels={async () =>
                    await mockData.filter((parcel) => parcelIds.includes(parcel.parcelId))
                }
                updateParcelStatuses={onDeleteParcels}
            />
        );
    });

    it("renders without crashing", () => {
        expect(screen.getAllByText("Statuses")[0]).toBeInTheDocument();
        expect(screen.getAllByText("Actions")[0]).toBeInTheDocument();
    });

    it("should open the status menu when the status button is clicked", async () => {
        const statusButton = screen.getByTestId("#status-button");
        fireEvent.click(statusButton);

        await waitFor(() => {
            expect(screen.getByTestId("#status-menu")).toBeInTheDocument();

            expect(screen.getByText("Parcel Denied")).toBeInTheDocument();
        });
    });

    it("should open the action menu when the item button is clicked", async () => {
        const statusButton = screen.getByTestId("#action-button");
        fireEvent.click(statusButton);

        await waitFor(() => {
            expect(screen.getByTestId("#action-menu")).toBeInTheDocument();

            expect(screen.getByText("Download Shopping List")).toBeInTheDocument();
        });
    });
});
