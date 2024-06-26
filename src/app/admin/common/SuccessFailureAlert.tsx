import React from "react";
import Alert from "@mui/material/Alert/Alert";

export type AlertOptions = {
    success: boolean | undefined;
    message: React.ReactNode;
};
export type SetAlertOptions = (alertOptions: AlertOptions) => void;

interface Props {
    alertOptions: AlertOptions;
    onClose: () => void;
}

const SuccessFailureAlert: React.FC<Props> = ({ alertOptions, onClose }) => {
    if (alertOptions.success === undefined) {
        return <></>;
    }

    return (
        <Alert severity={alertOptions.success ? "success" : "error"} onClose={onClose}>
            {alertOptions.message}
        </Alert>
    );
};

export default SuccessFailureAlert;
