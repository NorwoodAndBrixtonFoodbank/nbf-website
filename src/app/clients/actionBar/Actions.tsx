"use client";

import React, { useState } from "react";
import Menu from "@mui/material/Menu/Menu";
import MenuList from "@mui/material/MenuList/MenuList";
import MenuItem from "@mui/material/MenuItem/MenuItem";
import dayjs, { Dayjs } from "dayjs";
import { ClientsTableRow } from "@/app/clients/getClientsTableData";
import ActionsModal, { DriverOverviewInput } from "@/app/clients/actionBar/ActionsModal";
import {
    DriverOverviewModalButton,
    ShippingLabelsModalButton,
    ShoppingListModalButton,
} from "@/app/clients/actionBar/ActionsModalButton";

const isNotMoreThanOne = (value: number): boolean => {
    return value < 1;
};

const doesNotEqualsOne = (value: number): boolean => {
    return value !== 1;
};

const availableActions = {
    "Download Shipping Labels": {
        showSelectedParcels: true,
        errorCondition: isNotMoreThanOne,
        errorMessage: "Please select at least 1 row for download.",
    },
    "Download Shopping List": {
        showSelectedParcels: true,
        errorCondition: doesNotEqualsOne,
        errorMessage: "Please select only 1 row for download.",
    },
    "Download Driver Overview": {
        showSelectedParcels: true,
        errorCondition: isNotMoreThanOne,
        errorMessage: "Please select at least 1 row for download.",
    },
};

interface ActionsInputComponentProps {
    pdfType: String;
    onDateChange: (newDate: Dayjs | null) => void;
    onDriverNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ActionsInputComponent: React.FC<ActionsInputComponentProps> = ({
    pdfType,
    onDateChange,
    onDriverNameChange,
}) => {
    switch (pdfType) {
        case "Download Driver Overview":
            return (
                <DriverOverviewInput
                    onDateChange={onDateChange}
                    onDriverNameChange={onDriverNameChange}
                />
            );
        default:
            <></>;
    }
};

interface ActionsButtonProps {
    pdfType: String;
    data: ClientsTableRow[];
    date: Dayjs;
    driverName: string;
}

const ActionsButton: React.FC<ActionsButtonProps> = ({ pdfType, data, date, driverName }) => {
    switch (pdfType) {
        case "Download Shipping Labels":
            return <ShippingLabelsModalButton data={data} />;
        case "Download Shopping List":
            return <ShoppingListModalButton data={data} />;
        case "Download Driver Overview":
            return <DriverOverviewModalButton data={data} date={date} driverName={driverName} />;
        default:
            <></>;
    }
};

interface Props {
    selected: number[];
    data: ClientsTableRow[];
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
    const [selectedAction, setSelectedAction] = useState<string | null>(null);
    const [date, setDate] = useState(dayjs(new Date()));
    const [driverName, setDriverName] = useState("");

    const selectedData = Array.from(selected.map((index) => data[index]));

    const onDriverNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setDriverName(event.target.value);
    };

    const onDateChange = (newDate: Dayjs | null): void => {
        setDate((date) =>
            date
                .set("year", newDate?.year() ?? date.year())
                .set("month", newDate?.month() ?? date.month())
                .set("day", newDate?.day() ?? date.day())
        );
    };

    const onModalClose = (): void => {
        setSelectedAction(null);
        setModalError(null);
        setDate(dayjs(new Date()));
        setDriverName("");
    };

    const onMenuItemClick = (
        key: string,
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
                            showSelectedParcels={value.showSelectedParcels}
                            isOpen
                            onClose={onModalClose}
                            data={selectedData}
                            header={key}
                            errorText={modalError}
                            inputComponent={
                                <ActionsInputComponent
                                    pdfType={key}
                                    onDateChange={onDateChange}
                                    onDriverNameChange={onDriverNameChange}
                                />
                            }
                        >
                            <ActionsButton
                                pdfType={selectedAction}
                                data={selectedData}
                                date={date}
                                driverName={driverName}
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
                                        key,
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
