"use client";

import React, { useEffect, useState } from "react";
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
import { checkUserIsAdmin } from "@/app/parcels/ActionBar/ActionModals/adminActions";

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

type AvailableActionsType = {
    [actionKey in ActionName]: {
        newStatus: StatusType;
    };
};

export const adminAvailableActions: AvailableActionsType = {
    "Download Day Overview": {
        newStatus: "Day Overview Downloaded",
    },
    "Download Shopping Lists": {
        newStatus: "Shopping List Downloaded",
    },
    "Download Shipping Labels": {
        newStatus: "Shipping Labels Downloaded",
    },
    "Generate Map": {
        newStatus: "Map Generated",
    },
    "Download Driver Overview": {
        newStatus: "Driver Overview Downloaded",
    },
    "Delete Parcel": {
        newStatus: "Parcel Deleted",
    },
};

export const nonAdminAvailableActions: Omit<AvailableActionsType, "Delete Parcel"> = {
    "Download Day Overview": {
        newStatus: "Day Overview Downloaded",
    },
    "Download Shopping Lists": {
        newStatus: "Shopping List Downloaded",
    },
    "Download Shipping Labels": {
        newStatus: "Shipping Labels Downloaded",
    },
    "Generate Map": {
        newStatus: "Map Generated",
    },
    "Download Driver Overview": {
        newStatus: "Driver Overview Downloaded",
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
    const [userIsAdmin, setUserIsAdmin] = useState<boolean>(false);

    useEffect(() => {
        const isAdmin = async (): Promise<void> => {
            const { isSuccess, failureReason } = await checkUserIsAdmin();
            if (failureReason) {
                switch (failureReason) {
                    case "fetch user role error":
                    case "fetch user error":
                    case "unauthenticated":
                        setModalError(`Error authenticating as admin: ${failureReason}`);
                        break;
                    case "unauthorised":
                        break;
                }
            }
            setUserIsAdmin(isSuccess);
        };

        void isAdmin();
    }, []);

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
            {Object.entries(userIsAdmin ? adminAvailableActions : nonAdminAvailableActions).map(
                ([key, value]) => {
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
                }
            )}
            {actionAnchorElement && (
                <Menu
                    open
                    onClose={() => setActionAnchorElement(null)}
                    anchorEl={actionAnchorElement}
                >
                    <MenuList id="action-menu">
                        {Object.entries(
                            userIsAdmin ? adminAvailableActions : nonAdminAvailableActions
                        ).map(([key]) => {
                            return (
                                <MenuItem
                                    key={key}
                                    onClick={onMenuItemClick(
                                        key as ActionName,
                                        isNotAtLeastOne,
                                        errorMessage
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
