"use client";

import React, { useContext, useState } from "react";
import Menu from "@mui/material/Menu";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import { ParcelsTableRow } from "../parcelsTable/types";
import { ActionModalProps } from "./ActionModals/GeneralActionModal";
import DayOverviewModal from "./ActionModals/DayOverviewModal";
import DeleteParcelModal from "./ActionModals/DeleteParcelModal";
import DriverOverviewModal from "./ActionModals/DriverOverviewModal";
import GenerateMapModal from "./ActionModals/GenerateMapModal";
import ShippingLabelModal from "./ActionModals/ShippingLabelModal";
import ShoppingListModal from "./ActionModals/ShoppingListModal";
import { UpdateParcelStatuses } from "./ActionAndStatusBar";
import { allRoles, organisationRoles, RoleUpdateContext } from "@/app/roles";
import { UserRole } from "@/databaseUtils";
import DateChangeModal from "./ActionModals/DateChangeModal";
import SlotChangeModal from "./ActionModals/SlotChangeModal";

const isNotAtLeastOne = (value: number): boolean => {
    return value < 1;
};

const errorMessage = "Please select at least one parcel.";

export type ActionName =
    | "Change Packing Date"
    | "Change Packing Slot"
    | "Download Day Overview"
    | "Download Shopping Lists"
    | "Download Shipping Labels"
    | "Generate Map"
    | "Download Driver Overview"
    | "Delete Parcel";

type ActionTypes = {
    actionName: ActionName;
    availableToRole: UserRole[];
};

const availableActions: ActionTypes[] = [
    {
        actionName: "Change Packing Date",
        availableToRole: organisationRoles,
    },
    {
        actionName: "Change Packing Slot",
        availableToRole: organisationRoles,
    },
    {
        actionName: "Download Day Overview",
        availableToRole: allRoles,
    },
    {
        actionName: "Download Shopping Lists",
        availableToRole: allRoles,
    },
    {
        actionName: "Download Shipping Labels",
        availableToRole: allRoles,
    },
    {
        actionName: "Generate Map",
        availableToRole: allRoles,
    },
    {
        actionName: "Download Driver Overview",
        availableToRole: allRoles,
    },
    {
        actionName: "Delete Parcel",
        availableToRole: organisationRoles,
    },
];

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
        case "Change Packing Date":
            return <DateChangeModal {...actionModalProps} />;
        case "Change Packing Slot":
            return <SlotChangeModal {...actionModalProps} />;
        case "Download Shipping Labels":
            return <ShippingLabelModal {...actionModalProps} />;
        case "Download Shopping Lists":
            return <ShoppingListModal {...actionModalProps} />;
        case "Download Driver Overview":
            return <DriverOverviewModal {...actionModalProps} />;
        case "Download Day Overview":
            return <DayOverviewModal {...actionModalProps} />;
        case "Delete Parcel":
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
    const { role } = useContext(RoleUpdateContext);

    const getAvailableActionsForUserRole = (): ActionTypes[] => {
        if (role === null) {
            return [];
        }
        return availableActions.filter((action) => {
            return action.availableToRole.includes(role);
        });
    };

    const availableActionsForUserRole = getAvailableActionsForUserRole();

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
            {availableActionsForUserRole.map(({ actionName }) => {
                return (
                    modalToDisplay === actionName &&
                    getActionModal(actionName, {
                        isOpen: true,
                        onClose: onModalClose,
                        selectedParcels: selectedParcels,
                        header: modalToDisplay,
                        headerId: "action-modal-header",
                        actionName: modalToDisplay,
                        updateParcelStatuses: updateParcelStatuses,
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
                        {availableActionsForUserRole.map(({ actionName }) => {
                            return (
                                <MenuItem
                                    key={actionName}
                                    onClick={onMenuItemClick(
                                        actionName,
                                        isNotAtLeastOne,
                                        errorMessage
                                    )}
                                >
                                    {actionName}
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
