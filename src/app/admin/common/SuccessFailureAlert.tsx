import React, { ReactNode } from "react";
import Alert from "@mui/material/Alert/Alert";
import RefreshPageButton from "@/app/admin/common/RefreshPageButton";

export type AlertOptions = { success: boolean | undefined; message: ReactNode };
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
        <Alert
            severity={alertOptions.success ? "success" : "error"}
            action={alertOptions.success ? <RefreshPageButton /> : undefined}
            onClose={onClose}
        >
            {alertOptions.message}
        </Alert>
    );
};

export default SuccessFailureAlert;
