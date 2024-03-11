"use client";

import React from "react";
import { ParcelsTableRow } from "@/app/parcels/getParcelsTableData";
import ShippingLabels from "@/pdf/ShippingLabels/ShippingLabels";
import ShoppingList from "@/pdf/ShoppingList/ShoppingList";
import DayOverview from "@/pdf/DayOverview/DayOverview";
import DriverOverview from "@/pdf/DriverOverview/DriverOverview";
import { Dayjs } from "dayjs";

interface ModalButtonProps {
    parcels: ParcelsTableRow[];
}

interface ShippingLabelsButtonProps extends ModalButtonProps {
    labelQuantity: number;
}

export const ShippingLabelsModalButton: React.FC<ShippingLabelsButtonProps> = ({
    parcels,
    labelQuantity,
}) => {
    return (
        <ShippingLabels
            text="Download"
            parcelId={parcels[0].parcelId}
            labelQuantity={labelQuantity}
        />
    );
};

export const ShoppingListModalButton: React.FC<ModalButtonProps> = ({ parcels }) => {
    return (
        <ShoppingList
            text="Download"
            parcelIds={parcels.map((parcel: ParcelsTableRow) => {
                return parcel.parcelId;
            })}
        />
    );
};

export const DayOverviewModalButton: React.FC<{ collectionCentre: string; date: Date }> = ({
    collectionCentre,
    date,
}) => {
    return <DayOverview text="Download" date={date} collectionCentreKey={collectionCentre} />;
};

interface DriverOverviewModalButtonProps {
    parcels: ParcelsTableRow[];
    date: Dayjs;
    driverName: string;
}

export const DriverOverviewModalButton: React.FC<DriverOverviewModalButtonProps> = ({
    parcels,
    date,
    driverName,
}) => {
    const parcelIds = parcels.map((parcel) => {
        return parcel.parcelId;
    });
    return (
        <DriverOverview
            driverName={driverName}
            date={date.toDate()}
            text="Download"
            parcelIds={parcelIds}
        />
    );
};
