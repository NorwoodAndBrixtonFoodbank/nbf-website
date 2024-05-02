import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";
import { UserRow } from "@/app/admin/page";
import styled from "styled-components";
import Modal from "@/components/Modal/Modal";
import OptionButtonsDiv from "@/app/admin/common/OptionButtonsDiv";
import { SetAlertOptions } from "@/app/admin/common/SuccessFailureAlert";
import { logInfoReturnLogId } from "@/logger/logger";
import { adminDeleteUser, DeleteUserErrorType } from "@/server/adminDeleteUser";

const DangerDialog = styled(Modal)`
    .MuiPaper-root > div:first-child {
        background-color: ${(props) => props.theme.error};
        text-transform: uppercase;
    }

    button {
        text-transform: uppercase;
    }
`;

interface Props {
    userToDelete: UserRow | null;
    setUserToDelete: (user: UserRow | null) => void;
    setAlertOptions: SetAlertOptions;
}

const getErrorMessage = (errorType: DeleteUserErrorType): string => {
    switch (errorType) {
        case "failedToAuthenticateAsAdmin":
            return "Unable to authenticate current user";
        case "failedToFetchUserIdFromProfiles":
            return "Unable to retrieve user id";
        case "failedToDeleteUser":
            return "Unable to delete user";
    }
};

const DeleteUserDialog: React.FC<Props> = (props) => {
    if (props.userToDelete === null) {
        return <></>;
    }

    const onDeleteConfirm = async (): Promise<void> => {
        if (props.userToDelete === null) {
            return;
        }

        const { error: deleteUserError } = await adminDeleteUser(props.userToDelete.userId);

        if (deleteUserError) {
            const errorMessage = getErrorMessage(deleteUserError.type);
            props.setAlertOptions({
                success: false,
                message: <>{`${errorMessage}. Log ID: ${deleteUserError.logId}`}</>,
            });
        } else {
            props.setAlertOptions({
                success: true,
                message: (
                    <>
                        User <b>{props.userToDelete!.email}</b> deleted successfully.
                    </>
                ),
            });
            void logInfoReturnLogId(`${props.userToDelete?.email} deleted successfully.`);
        }

        props.setUserToDelete(null);
    };

    const onDeleteCancel = (): void => {
        props.setUserToDelete(null);
    };

    return (
        <DangerDialog
            header="Delete User"
            headerId="deleteUserDialog"
            isOpen
            onClose={onDeleteCancel}
        >
            Are you sure you want to delete user <b>{props.userToDelete.email}</b>
            ?
            <br />
            <OptionButtonsDiv>
                <Button
                    color="error"
                    variant="outlined"
                    startIcon={<DeleteIcon />}
                    onClick={onDeleteConfirm}
                >
                    Confirm
                </Button>
                <Button color="secondary" onClick={onDeleteCancel}>
                    Cancel
                </Button>
            </OptionButtonsDiv>
        </DangerDialog>
    );
};

export default DeleteUserDialog;
