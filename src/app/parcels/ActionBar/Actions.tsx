"use client";

import React, { SetStateAction, useState } from "react";
import Menu from "@mui/material/Menu/Menu";
import MenuList from "@mui/material/MenuList/MenuList";
import MenuItem from "@mui/material/MenuItem/MenuItem";
import dayjs, { Dayjs } from "dayjs";
import { ParcelsTableRow } from "@/app/parcels/getParcelsTableData";
import ActionsModal, {
    DayOverviewInput,
    DriverOverviewInput,
    ShippingLabelsInput,
    ShoppingListsConfirmation,
} from "@/app/parcels/ActionBar/ActionsModal";
import {
    DayOverviewModalButton,
    DeleteParcelRequestModalButton,
    DriverOverviewModalButton,
    ShippingLabelsModalButton,
    ShoppingListModalButton,
} from "@/app/parcels/ActionBar/ActionsModalButton";
import { Button, SelectChangeEvent } from "@mui/material";
import { Centerer } from "@/components/Modal/ModalFormStyles";
import { styled } from "styled-components";

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
        message?: string;
    };
};

const availableActions: AvailableActionsType = {
    "Download Shipping Labels": {
        showSelectedParcelsInModal: true,
        errorCondition: doesNotEqualOne,
        errorMessage: "Please select exactly one parcel.",
    },
    "Download Shopping Lists": {
        showSelectedParcelsInModal: true,
        errorCondition: isNotAtLeastOne,
        errorMessage: "Please select at least one parcel.",
    },
    "Download Driver Overview": {
        showSelectedParcelsInModal: true,
        errorCondition: isNotAtLeastOne,
        errorMessage: "Please select at least one parcel.",
    },
    "Download Day Overview": {
        showSelectedParcelsInModal: false,
        errorCondition: doesNotEqualZero,
        errorMessage:
            "The day overview will show the parcels for a particular date and location. It will show not the currently selected parcel. Please unselect the parcels.",
    },
    "Delete Parcel Request": {
        showSelectedParcelsInModal: true,
        errorCondition: isNotAtLeastOne,
        errorMessage: "Please select at least one parcel.",
        message: "Are you sure you want to delete the selected parcel request?"
    }
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

interface ActionsButtonComponentProps {
    loading: boolean;
    setLoading: React.Dispatch<SetStateAction<boolean>>;
    actionType: PdfType;
}

const ActionsButtonComponent: React.FC<ActionsButtonComponentProps> = ({
    loading,
    setLoading,
    actionType
}) => {
    const ConfirmButtons = styled.div`
        display: flex;
        flex-direction: row;
        gap: 2rem;
        align-items: stretch;
    `;

    switch (actionType) {
        case "Delete Parcel Request":
            return (<Centerer>
            <ConfirmButtons>
            <Button
                disabled={loading}
                variant="contained"
                onClick={() => setLoading(true)}
            >
                {loading ? "Loading..." : "Cancel"}
            </Button>
            <Button
                disabled={loading}
                variant="contained"
                onClick={() => setLoading(true)}
            >
                {loading ? "Loading..." : "Delete"}
            </Button>
            </ConfirmButtons>
            </Centerer>)
        default:
            return (<Centerer>
                <Button
                    disabled={loading}
                    variant="contained"
                    onClick={() => setLoading(true)}
                >
                    {loading ? "Loading..." : "Create PDF"}
                </Button>
                </Centerer>);
    }}

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
        case "Delete Parcel Request":
            return <DeleteParcelRequestModalButton data={data} />
        default:
            <></>;
    }
};

interface Props {
    selected: number[];
    data: ParcelsTableRow[];
    actionAnchorElement: HTMLElement | null;
    setActionAnchorElement: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
    modalError: string | null;
    setModalError: React.Dispatch<React.SetStateAction<string | null>>;
}

const Actions: React.FC<Props> = ({
    selected,
    data,
    actionAnchorElement,
    setActionAnchorElement,
    modalError,
    setModalError,
}) => {
    const [selectedAction, setSelectedAction] = useState<PdfType | null>(null);
    const [labelQuantity, setLabelQuantity] = useState<number>(0);
    const [date, setDate] = useState(dayjs());
    const [driverName, setDriverName] = useState("");
    const [collectionCentre, setCollectionCentre] = useState("");
    const [loading, setLoading] = useState<boolean>(false);

    const selectedData = Array.from(selected.map((index) => data[index]));

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
                            isOpen
                            onClose={onModalClose}
                            data={selectedData}
                            header={key}
                            headerId="action-modal-header"
                            errorText={modalError}
                            message={value.message}
                            loading={loading}
                            setLoading={setLoading}
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
                            buttons={
                                <ActionsButtonComponent
                                    actionType={key}
                                    loading={loading}
                                    setLoading={setLoading}   
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
