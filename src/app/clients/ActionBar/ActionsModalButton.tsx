import React from "react";
import { ClientsTableRow } from "@/app/clients/getClientsTableData";
import ShippingLabels from "@/pdf/ShippingLabels/ShippingLabels";
import ShoppingList from "@/pdf/ShoppingList/ShoppingList";
import DriverOverview from "@/pdf/DriverOverview/DriverOverview";
import { Dayjs } from "dayjs";

interface ModalButtonProps {
    data: ClientsTableRow[];
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

interface DriverOverviewModalButtonProps {
    data: ClientsTableRow[];
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
