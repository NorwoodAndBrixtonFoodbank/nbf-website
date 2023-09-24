"use client";

import React from "react";
import { ParcelsTableRow } from "@/app/parcels/getParcelsTableData";
import ShippingLabels from "@/pdf/ShippingLabels/ShippingLabels";
import ShoppingList from "@/pdf/ShoppingList/ShoppingList";
import DayOverview from "@/pdf/DayOverview/DayOverview";
import DriverOverview from "@/pdf/DriverOverview/DriverOverview";
import { Dayjs } from "dayjs";

interface ModalButtonProps {
    data: ParcelsTableRow[];
}

export const ShippingLabelsModalButton: React.FC<ModalButtonProps> = ({ data }) => {
    const parcelIds = data.map((parcel) => {
        return parcel.parcelId;
    });
    return <ShippingLabels text="Download" parcelIds={parcelIds} />;
};

export const ShoppingListModalButton: React.FC<ModalButtonProps> = ({ data }) => {
    return <ShoppingList text="Download" parcelId={data[0].parcelId} />;
};

export const DayOverviewModalButton: React.FC<{ collectionCentre: string; date: Date }> = ({
    collectionCentre,
    date,
}) => {
    return <DayOverview text="Download" date={date} collectionCentreKey={collectionCentre} />;
};

interface DriverOverviewModalButtonProps {
    data: ParcelsTableRow[];
    date: Dayjs;
    driverName: string;
}

export const DriverOverviewModalButton: React.FC<DriverOverviewModalButtonProps> = ({
    data,
    date,
    driverName,
}) => {
    const parcelIds = data.map((parcel) => {
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
