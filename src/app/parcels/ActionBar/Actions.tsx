"use client";

import React, { useState } from "react";
import Menu from "@mui/material/Menu/Menu";
import MenuList from "@mui/material/MenuList/MenuList";
import MenuItem from "@mui/material/MenuItem/MenuItem";
import { ParcelsTableRow } from "@/app/parcels/getParcelsTableData";
import { StatusType } from "./Statuses";
import { ActionModalProps } from "./ActionModals/GeneralActionModal";
import DayOverviewModal from "./ActionModals/DayOverviewModal";
import DeleteParcelModal from "./ActionModals/DeleteParcelModal";
import DriverOverviewModal from "./ActionModals/DriverOverviewModal";
import GenerateMapModal from "./ActionModals/GenerateMapModal";
import ShippingLabelModal from "./ActionModals/ShippingLabelModal";
import ShoppingListModal from "./ActionModals/ShoppingListModal";
import { UpdateParcelStatuses } from "./ActionAndStatusBar";

const isNotAtLeastOne = (value: number): boolean => {
    return value < 1;
};

const doesNotEqualOne = (value: number): boolean => {
    return value !== 1;
};

const doesNotEqualZero = (value: number): boolean => {
    return value !== 0;
};

export type ActionName =
    | "Download Shipping Labels"
    | "Download Shopping Lists"
    | "Download Driver Overview"
    | "Download Day Overview"
    | "Delete Parcel Request"
    | "Generate Map";

type AvailableActionsType = {
    [actionKey in ActionName]: {
        errorCondition: (value: number) => boolean;
        errorMessage: string;
        newStatus: StatusType;
    };
};

export const availableActions: AvailableActionsType = {
    "Download Shipping Labels": {
        errorCondition: doesNotEqualOne,
        errorMessage: "Please select exactly one parcel.",
        newStatus: "Shipping Labels Downloaded",
    },
    "Download Shopping Lists": {
        errorCondition: isNotAtLeastOne,
        errorMessage: "Please select at least one parcel.",
        newStatus: "Shopping List Downloaded",
    },
    "Download Driver Overview": {
        errorCondition: isNotAtLeastOne,
        errorMessage: "Please select at least one parcel.",
        newStatus: "Driver Overview Downloaded",
    },
    "Download Day Overview": {
        errorCondition: isNotAtLeastOne,
        errorMessage: "Please select at least one parcel.",
        newStatus: "Day Overview Downloaded",
    },
    "Delete Parcel Request": {
        errorCondition: isNotAtLeastOne,
        errorMessage: "Please select at least one parcel.",
        newStatus: "Request Deleted",
    },
    "Generate Map": {
        errorCondition: isNotAtLeastOne,
        errorMessage: "Please select at least one parcel.",
        newStatus: "Map Generated",
    },
};

interface Props {
    fetchSelectedParcels: () => Promise<ParcelsTableRow[]>;
    updateParcelStatuses: UpdateParcelStatuses;
    actionAnchorElement: HTMLElement | null;
    setActionAnchorElement: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
    setModalError: React.Dispatch<React.SetStateAction<string | null>>;
}

const getActionModal = (
    actionName: ActionName,
    actionModalProps: ActionModalProps
): React.ReactElement => {
    switch (actionName) {
        case "Download Shipping Labels":
            return <ShippingLabelModal {...actionModalProps} />;
        case "Download Shopping Lists":
            return <ShoppingListModal {...actionModalProps} />;
        case "Download Driver Overview":
            return <DriverOverviewModal {...actionModalProps} />;
        case "Download Day Overview":
            return <DayOverviewModal {...actionModalProps} />;
        case "Delete Parcel Request":
            return <DeleteParcelModal {...actionModalProps} />;
        case "Generate Map":
            return <GenerateMapModal {...actionModalProps} />;
    }
};

const Actions: React.FC<Props> = ({
    fetchSelectedParcels,
    updateParcelStatuses,
    actionAnchorElement,
    setActionAnchorElement,
    setModalError,
}) => {
    const [selectedParcels, setSelectedParcels] = useState<ParcelsTableRow[]>([]);
    const [modalToDisplay, setModalToDisplay] = useState<ActionName | null>(null);

    const onModalClose = (): void => {
        setModalToDisplay(null);
        setModalError(null);
    };

    const onMenuItemClick = (
        key: ActionName,
        errorCondition: (value: number) => boolean,
        errorMessage: string
    ): (() => void) => {
        return async () => {
            try {
                const fetchedParcels = await fetchSelectedParcels();
                setSelectedParcels(fetchedParcels);
                if (errorCondition(fetchedParcels.length)) {
                    setActionAnchorElement(null);
                    setModalError(errorMessage);
                } else {
                    setModalToDisplay(key);
                    setActionAnchorElement(null);
                    setModalError(null);
                    return;
                }
            } catch {
                setModalError("Database error when fetching selected parcels");
                return;
            }
        };
    };

    return (
        <>
            {Object.entries(availableActions).map(([key, value]) => {
                return (
                    modalToDisplay === key &&
                    getActionModal(key, {
                        isOpen: true,
                        onClose: onModalClose,
                        selectedParcels: selectedParcels,
                        header: modalToDisplay,
                        headerId: "action-modal-header",
                        actionName: modalToDisplay,
                        updateParcelStatuses: updateParcelStatuses,
                        newStatus: value.newStatus,
                    })
                );
            })}
            {actionAnchorElement && (
                <Menu
                    open
                    onClose={() => setActionAnchorElement(null)}
                    anchorEl={actionAnchorElement}
                >
                    <MenuList id="action-menu">
                        {Object.entries(availableActions).map(([key, value]) => {
                            return (
                                <MenuItem
                                    key={key}
                                    onClick={onMenuItemClick(
                                        key as ActionName,
                                        value.errorCondition,
                                        value.errorMessage
                                    )}
                                >
                                    {key}
                                </MenuItem>
                            );
                        })}
                    </MenuList>
                </Menu>
            )}
        </>
    );
};

export default Actions;
