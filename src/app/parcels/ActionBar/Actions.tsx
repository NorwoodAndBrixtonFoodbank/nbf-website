"use client";

import React, { useState } from "react";
import Menu from "@mui/material/Menu/Menu";
import MenuList from "@mui/material/MenuList/MenuList";
import MenuItem from "@mui/material/MenuItem/MenuItem";
import dayjs, { Dayjs } from "dayjs";
import { ParcelsTableRow } from "@/app/parcels/getParcelsTableData";
import ActionsModal, {
    ActionType,
    DayOverviewInput,
    DriverOverviewInput,
    ShippingLabelsInput,
    ShoppingListsConfirmation,
} from "@/app/parcels/ActionBar/ActionsModal";
import {
    DayOverviewModalButton,
    DriverOverviewModalButton,
    ShippingLabelsModalButton,
    ShoppingListModalButton,
} from "@/app/parcels/ActionBar/ActionsModalButton";
import { SelectChangeEvent } from "@mui/material";

const isNotAtLeastOne = (value: number): boolean => {
    return value < 1;
};

const doesNotEqualOne = (value: number): boolean => {
    return value !== 1;
};

const doesNotEqualZero = (value: number): boolean => {
    return value !== 0;
};

type ActionName =
    | "Download Shipping Labels"
    | "Download Shopping Lists"
    | "Download Driver Overview"
    | "Download Day Overview"
    | "Delete Parcel Request"
    | "Generate Map";

type AvailableActionsType = {
    [actionKey in ActionName]: {
        showSelectedParcelsInModal: boolean;
        errorCondition: (value: number) => boolean;
        errorMessage: string;
        actionType: ActionType;
    };
};

const availableActions: AvailableActionsType = {
    "Download Shipping Labels": {
        showSelectedParcelsInModal: true,
        errorCondition: doesNotEqualOne,
        errorMessage: "Please select exactly one parcel.",
        actionType: "pdfDownload",
    },
    "Download Shopping Lists": {
        showSelectedParcelsInModal: true,
        errorCondition: isNotAtLeastOne,
        errorMessage: "Please select at least one parcel.",
        actionType: "pdfDownload",
    },
    "Download Driver Overview": {
        showSelectedParcelsInModal: true,
        errorCondition: isNotAtLeastOne,
        errorMessage: "Please select at least one parcel.",
        actionType: "pdfDownload",
    },
    "Download Day Overview": {
        showSelectedParcelsInModal: false,
        errorCondition: doesNotEqualZero,
        errorMessage:
            "The day overview will show the parcels for a particular date and location. It will show not the currently selected parcel. Please unselect the parcels.",
        actionType: "pdfDownload",
    },
    "Delete Parcel Request": {
        showSelectedParcelsInModal: true,
        errorCondition: isNotAtLeastOne,
        errorMessage: "Please select at least one parcel.",
        actionType: "deleteParcel",
    },
    "Generate Map": {
        showSelectedParcelsInModal: false,
        errorCondition: isNotAtLeastOne,
        errorMessage: "Please select at least one parcel.",
        actionType: "generateMap",
    },
};

interface ActionsInputComponentProps {
    actionName: ActionName;
    selectedParcels: ParcelsTableRow[];
    onDateChange: (newDate: Dayjs | null) => void;
    onLabelQuantityChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onDriverNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onCollectionCentreChange: (event: SelectChangeEvent) => void;
    setCollectionCentre: React.Dispatch<React.SetStateAction<string>>;
}

const ActionsInputComponent: React.FC<ActionsInputComponentProps> = ({
    actionName,
    selectedParcels,
    onDateChange,
    onLabelQuantityChange,
    onDriverNameChange,
    onCollectionCentreChange,
    setCollectionCentre,
}) => {
    switch (actionName) {
        case "Download Shipping Labels":
            return <ShippingLabelsInput onLabelQuantityChange={onLabelQuantityChange} />;
        case "Download Shopping Lists":
            return <ShoppingListsConfirmation parcels={selectedParcels} />;
        case "Download Driver Overview":
            return (
                <DriverOverviewInput
                    onDateChange={onDateChange}
                    onDriverNameChange={onDriverNameChange}
                />
            );
        case "Download Day Overview":
            return (
                <DayOverviewInput
                    onDateChange={onDateChange}
                    onCollectionCentreChange={onCollectionCentreChange}
                    setCollectionCentre={setCollectionCentre}
                />
            );
        default:
            <></>;
    }
};

interface ActionsButtonProps {
    pdfType: ActionName;
    selectedParcels: ParcelsTableRow[];
    date: Dayjs;
    labelQuantity: number;
    driverName: string;
    collectionCentre: string;
}

const ActionsButton: React.FC<ActionsButtonProps> = ({
    pdfType,
    selectedParcels,
    date,
    labelQuantity,
    driverName,
    collectionCentre,
}) => {
    switch (pdfType) {
        case "Download Shipping Labels":
            return (
                <ShippingLabelsModalButton
                    parcels={selectedParcels}
                    labelQuantity={labelQuantity}
                />
            );
        case "Download Shopping Lists":
            return <ShoppingListModalButton parcels={selectedParcels} />;
        case "Download Driver Overview":
            return (
                <DriverOverviewModalButton
                    parcels={selectedParcels}
                    date={date}
                    driverName={driverName}
                />
            );
        case "Download Day Overview":
            return (
                <DayOverviewModalButton collectionCentre={collectionCentre} date={date.toDate()} />
            );
        default:
            <></>;
    }
};

interface Props {
    fetchSelectedParcels: (checkedParcelIds: string[]) => Promise<ParcelsTableRow[]>;
    onDeleteParcels: (parcels: ParcelsTableRow[]) => void;
    actionAnchorElement: HTMLElement | null;
    setActionAnchorElement: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
    modalError: string | null;
    setModalError: React.Dispatch<React.SetStateAction<string | null>>;
    parcelIds: string[];
}

const Actions: React.FC<Props> = ({
    fetchSelectedParcels,
    onDeleteParcels,
    actionAnchorElement,
    setActionAnchorElement,
    modalError,
    setModalError,
    parcelIds,
}) => {
    const [selectedParcels, setSelectedParcels] = useState<ParcelsTableRow[]>([]);
    const [modalToDisplay, setModalToDisplay] = useState<ActionName | null>(null);
    const [labelQuantity, setLabelQuantity] = useState<number>(0);
    const [date, setDate] = useState(dayjs());
    const [driverName, setDriverName] = useState("");
    const [collectionCentre, setCollectionCentre] = useState("");

    const onLabelQuantityChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setLabelQuantity(parseInt(event.target.value, 10) ?? 0);
    };

    const onDriverNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setDriverName(event.target.value);
    };

    const onCollectionCentreChange = (event: SelectChangeEvent): void => {
        setCollectionCentre(event.target.value);
    };

    const onDateChange = (newDate: Dayjs | null): void => {
        setDate(newDate!);
    };

    const onModalClose = (): void => {
        setModalToDisplay(null);
        setModalError(null);
        setDate(dayjs());
        setDriverName("");
    };

    const onMenuItemClick = (
        key: ActionName,
        errorCondition: (value: number) => boolean,
        errorMessage: string
    ): (() => void) => {
        return async () => {
            try {
                const fetchedParcels = await fetchSelectedParcels(parcelIds);
                setSelectedParcels(fetchedParcels);
                if (errorCondition(fetchedParcels.length)) {
                    setActionAnchorElement(null);
                    setModalError(errorMessage);
                } else {
                    switch (key) {
                        case "Download Shipping Labels":
                        case "Download Shopping Lists":
                        case "Download Driver Overview":
                        case "Download Day Overview":
                        case "Delete Parcel Request":
                            setModalToDisplay(key);
                            setActionAnchorElement(null);
                            setModalError(null);
                            return;
                        case "Generate Map":
                            openInNewTab(mapsLinkForSelectedParcels());
                            return;
                    }
                }
            } catch {
                setModalError("Database error when fetching selected parcels");
                return;
            }
        };
    };

    const mapsLinkForSelectedParcels = (): string => {
        return (
            "https://www.google.com/maps/dir/" +
            selectedParcels.map((parcel) => parcel.addressPostcode.replaceAll(" ", "")).join("/") +
            "//"
        );
    };

    const openInNewTab = (url: string): void => {
        window.open(url, "_blank", "noopener, noreferrer");
    };

    return (
        <>
            {Object.entries(availableActions).map(([key, value]) => {
                return (
                    modalToDisplay === key && (
                        <ActionsModal
                            key={key}
                            showSelectedParcels={value.showSelectedParcelsInModal}
                            isOpen
                            onClose={onModalClose}
                            selectedParcels={selectedParcels}
                            header={key}
                            headerId="action-modal-header"
                            errorText={modalError}
                            actionType={value.actionType}
                            onDeleteParcels={onDeleteParcels}
                            inputComponent={
                                <ActionsInputComponent
                                    actionName={key}
                                    selectedParcels={selectedParcels}
                                    onDateChange={onDateChange}
                                    onLabelQuantityChange={onLabelQuantityChange}
                                    onDriverNameChange={onDriverNameChange}
                                    onCollectionCentreChange={onCollectionCentreChange}
                                    setCollectionCentre={setCollectionCentre}
                                />
                            }
                        >
                            <ActionsButton
                                pdfType={modalToDisplay}
                                selectedParcels={selectedParcels}
                                date={date}
                                labelQuantity={labelQuantity}
                                driverName={driverName}
                                collectionCentre={collectionCentre}
                            />
                        </ActionsModal>
                    )
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
