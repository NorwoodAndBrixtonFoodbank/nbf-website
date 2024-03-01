"use client";

import React, { useEffect, useState } from "react";
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

type PdfType =
    | "Download Shipping Labels"
    | "Download Shopping Lists"
    | "Download Driver Overview"
    | "Download Day Overview"
    | "Delete Parcel Request";

type AvailableActionsType = {
    [pdfKey in PdfType]: {
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
};

interface ActionsInputComponentProps {
    pdfType: PdfType;
    selectedParcels: ParcelsTableRow[];
    onDateChange: (newDate: Dayjs | null) => void;
    onLabelQuantityChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onDriverNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onCollectionCentreChange: (event: SelectChangeEvent) => void;
    setCollectionCentre: React.Dispatch<React.SetStateAction<string>>;
}

const ActionsInputComponent: React.FC<ActionsInputComponentProps> = ({
    pdfType,
    selectedParcels,
    onDateChange,
    onLabelQuantityChange,
    onDriverNameChange,
    onCollectionCentreChange,
    setCollectionCentre,
}) => {
    switch (pdfType) {
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
    pdfType: PdfType;
    data: ParcelsTableRow[];
    date: Dayjs;
    labelQuantity: number;
    driverName: string;
    collectionCentre: string;
}

const ActionsButton: React.FC<ActionsButtonProps> = ({
    pdfType,
    data,
    date,
    labelQuantity,
    driverName,
    collectionCentre,
}) => {
    switch (pdfType) {
        case "Download Shipping Labels":
            return <ShippingLabelsModalButton data={data} labelQuantity={labelQuantity} />;
        case "Download Shopping Lists":
            return <ShoppingListModalButton data={data} />;
        case "Download Driver Overview":
            return <DriverOverviewModalButton data={data} date={date} driverName={driverName} />;
        case "Download Day Overview":
            return (
                <DayOverviewModalButton collectionCentre={collectionCentre} date={date.toDate()} />
            );
        default:
            <></>;
    }
};

interface Props {
    selectedRowIndices: number[];
    setSelectedRowIndices: React.Dispatch<React.SetStateAction<number[]>>;
    data: ParcelsTableRow[];
    actionAnchorElement: HTMLElement | null;
    setActionAnchorElement: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
    modalError: string | null;
    setModalError: React.Dispatch<React.SetStateAction<string | null>>;
}

const Actions: React.FC<Props> = ({
    selectedRowIndices,
    setSelectedRowIndices,
    data,
    actionAnchorElement,
    setActionAnchorElement,
    modalError,
    setModalError
}) => {
    const [selectedAction, setSelectedAction] = useState<PdfType | null>(null);
    const [labelQuantity, setLabelQuantity] = useState<number>(0);
    const [date, setDate] = useState(dayjs());
    const [driverName, setDriverName] = useState("");
    const [collectionCentre, setCollectionCentre] = useState("");

    const [selectedData, setSelectedData] = useState(
        Array.from(selectedRowIndices.map((index) => data[index]))
    );

    useEffect(() => {
        setSelectedData(Array.from(selectedRowIndices.map((index) => data[index])));
    }, [selectedRowIndices, data]);

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
        setSelectedAction(null);
        setModalError(null);
        setDate(dayjs());
        setDriverName("");
    };

    const onMenuItemClick = (
        key: PdfType,
        errorCondition: (value: number) => boolean,
        errorMessage: string
    ): (() => void) => {
        return () => {
            if (errorCondition(selectedData.length)) {
                setActionAnchorElement(null);
                setModalError(errorMessage);
            } else {
                setSelectedAction(key);
                setActionAnchorElement(null);
                setModalError(null);
            }
        };
    };

    return (
        <>
            {Object.entries(availableActions).map(([key, value]) => {
                return (
                    selectedAction === key && (
                        <ActionsModal
                            key={key}
                            showSelectedParcels={value.showSelectedParcelsInModal}
                            setSelectedRowIndices={setSelectedRowIndices}
                            isOpen
                            onClose={onModalClose}
                            data={selectedData}
                            header={key}
                            headerId="action-modal-header"
                            errorText={modalError}
                            actionType={value.actionType}
                            inputComponent={
                                <ActionsInputComponent
                                    pdfType={key}
                                    selectedParcels={selectedData}
                                    onDateChange={onDateChange}
                                    onLabelQuantityChange={onLabelQuantityChange}
                                    onDriverNameChange={onDriverNameChange}
                                    onCollectionCentreChange={onCollectionCentreChange}
                                    setCollectionCentre={setCollectionCentre}
                                />
                            }
                        >
                            <ActionsButton
                                pdfType={selectedAction}
                                data={selectedData}
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
                                        key as PdfType,
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
