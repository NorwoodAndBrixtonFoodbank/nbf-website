import React, { useState } from "react";
import { UserRow } from "../usersTable/types";
import { SetAlertOptions } from "@/app/admin/common/SuccessFailureAlert";
import { logInfoReturnLogId } from "@/logger/logger";
import { adminDeleteUser, DeleteUserErrorType } from "@/server/adminDeleteUser";
import ConfirmDeleteModal from "@/components/Modal/ConfirmDialog";
import DeleteConfirmationDialog from "@/components/Modal/DeleteConfirmationDialog";

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
    const [isConfirmationDialogueOpen, setIsConfirmationDialogueOpen] = useState<boolean>(false);

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
                        User <b>{props.userToDelete.email}</b> deleted successfully.
                    </>
                ),
            });
            void logInfoReturnLogId(`${props.userToDelete.email} deleted successfully.`);
        }

        props.setUserToDelete(null);
    };

    const onDeleteCancel = (): void => {
        props.setUserToDelete(null);
    };

    return (
        <>
            <ConfirmDeleteModal
                isOpen
                message={`Are you sure you want to delete user ${props.userToDelete.email}?`}
                onCancel={onDeleteCancel}
                onConfirm={() => setIsConfirmationDialogueOpen(true)}
            />
            <DeleteConfirmationDialog
                isOpen={isConfirmationDialogueOpen}
                onClose={() => setIsConfirmationDialogueOpen(false)}
                onClickCancel={() => setIsConfirmationDialogueOpen(false)}
                onClickConfirm={onDeleteConfirm}
                deletionText={`You are about to delete this user: ${props.userToDelete.email}`}
            />
        </>
    );
};

export default DeleteUserDialog;
