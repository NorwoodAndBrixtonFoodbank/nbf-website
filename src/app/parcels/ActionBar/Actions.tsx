"use client";

import React, { useContext, useEffect, useState } from "react";
import Menu from "@mui/material/Menu/Menu";
import MenuList from "@mui/material/MenuList/MenuList";
import MenuItem from "@mui/material/MenuItem/MenuItem";
import { ParcelsTableRow } from "../parcelsTable/types";
import { StatusType } from "./Statuses";
import { ActionModalProps } from "./ActionModals/GeneralActionModal";
import DayOverviewModal from "./ActionModals/DayOverviewModal";
import DeleteParcelModal from "./ActionModals/DeleteParcelModal";
import DriverOverviewModal from "./ActionModals/DriverOverviewModal";
import GenerateMapModal from "./ActionModals/GenerateMapModal";
import ShippingLabelModal from "./ActionModals/ShippingLabelModal";
import ShoppingListModal from "./ActionModals/ShoppingListModal";
import { UpdateParcelStatuses } from "./ActionAndStatusBar";
import { RoleUpdateContext } from "@/app/roles";

const isNotAtLeastOne = (value: number): boolean => {
    return value < 1;
};

const errorMessage = "Please select at least one parcel.";

export type ActionName =
    | "Download Day Overview"
    | "Download Shopping Lists"
    | "Download Shipping Labels"
    | "Generate Map"
    | "Download Driver Overview"
    | "Delete Parcel";

type ActionTypes = {
    actionName: ActionName;
    newStatus: StatusType;
    availableToVolunteers: boolean;
};

const availableActions: ActionTypes[] = [
    {
        actionName: "Download Day Overview",
        newStatus: "Day Overview Downloaded",
        availableToVolunteers: true,
    },
    {
        actionName: "Download Shopping Lists",
        newStatus: "Shopping List Downloaded",
        availableToVolunteers: true,
    },
    {
        actionName: "Download Shipping Labels",
        newStatus: "Shipping Labels Downloaded",
        availableToVolunteers: true,
    },
    {
        actionName: "Generate Map",
        newStatus: "Map Generated",
        availableToVolunteers: true,
    },
    {
        actionName: "Download Driver Overview",
        newStatus: "Driver Overview Downloaded",
        availableToVolunteers: true,
    },
    {
        actionName: "Delete Parcel",
        newStatus: "Parcel Deleted",
        availableToVolunteers: false,
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
    const [availableActionsForUserRole, setAvailableActionsForUserRole] = useState<ActionTypes[]>(
        []
    );
    const { role } = useContext(RoleUpdateContext);

    useEffect(() => {
        if (role === "volunteer") {
            const actionList = availableActions.filter((action) => action.availableToVolunteers);
            setAvailableActionsForUserRole(actionList);
        } else {
            setAvailableActionsForUserRole(availableActions);
        }
    }, [role]);

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
            {availableActionsForUserRole.map(({ actionName, newStatus }) => {
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
                        newStatus: newStatus,
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
