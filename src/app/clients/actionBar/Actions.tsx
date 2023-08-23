"use client";

import React, { useState } from "react";
import Menu from "@mui/material/Menu/Menu";
import MenuList from "@mui/material/MenuList/MenuList";
import MenuItem from "@mui/material/MenuItem/MenuItem";
import dayjs, { Dayjs } from "dayjs";
import { ClientsTableRow } from "@/app/clients/getClientsTableData";
import ActionsModal, {
    DriverOverviewInput,
    DriverOverviewModalButton,
    ShippingLabelsModalButton,
    ShoppingListModalButton,
} from "@/app/clients/actionBar/ActionsModal";

const notMoreThanOne = (value: number): boolean => {
    return value < 1;
};

const notEqualsOne = (value: number): boolean => {
    return value !== 1;
};

const availableActions = {
    "Print Shipping Labels": {
        showSelectedParcels: true,
        errorCondition: notMoreThanOne,
        errorMessage: "Please select rows for printing.",
    },
    "Print Shopping List": {
        showSelectedParcels: true,
        errorCondition: notEqualsOne,
        errorMessage: "Please select only 1 row for printing.",
    },
    "Print Driver Overview": {
        showSelectedParcels: true,
        errorCondition: notMoreThanOne,
        errorMessage: "Please select rows for printing.",
    },
};

interface ActionsInputComponent {
    pdfType: String;
    onDateChange: (newDate: Dayjs | null) => void;
    onDriverNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ActionsInputComponent: React.FC<ActionsInputComponent> = ({ pdfType, onDateChange, onDriverNameChange }) => {
    switch (pdfType) {
        case "Print Driver Overview":
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
        case "Print Shipping Labels":
            return <ShippingLabelsModalButton data={data} />;
        case "Print Shopping List":
            return <ShoppingListModalButton data={data} />;
        case "Print Driver Overview":
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
    const selectedData = Array.from(selected.map((index) => data[index]));
    const [selectedAction, setSelectedAction] = useState<string | null>(null);
    const [date, setDate] = useState(dayjs(new Date()));
    const [driverName, setDriverName] = useState("");

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
    return (
        <>
            {Object.entries(availableActions).map(([key, value]) => {
                return selectedAction === key ? (
                    <ActionsModal
                        key={key}
                        showSelectedParcels={value.showSelectedParcels}
                        isOpen
                        onClose={() => {
                            setSelectedAction(null);
                            setModalError(null);
                            setDate(dayjs(new Date()));
                            setDriverName("");
                        }}
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
                ) : (
                    <></>
                );
            })}
            {actionAnchorElement ? (
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
                                    onClick={() => {
                                        if (value.errorCondition(selectedData.length)) {
                                            setActionAnchorElement(null);
                                            setModalError(value.errorMessage);
                                        } else {
                                            setSelectedAction(key);
                                            setActionAnchorElement(null);
                                            setModalError(null);
                                        }
                                    }}
                                >
                                    {key}
                                </MenuItem>
                            );
                        })}
                    </MenuList>
                </Menu>
            ) : (
                <></>
            )}
        </>
    );
};

export default Actions;
