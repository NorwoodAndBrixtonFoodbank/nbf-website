"use client";

import React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import "dayjs/locale/en-gb";

interface Props {
    children: React.ReactNode;
}

const Localization: React.FC<Props> = ({ children }) => {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
            {children}
        </LocalizationProvider>
    );
};

export default Localization;
