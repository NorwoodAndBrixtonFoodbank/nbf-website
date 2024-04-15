import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";
import { UserRow } from "@/app/admin/page";
import styled from "styled-components";
import Modal from "@/components/Modal/Modal";
import OptionButtonsDiv from "@/app/admin/common/OptionButtonsDiv";
import { SetAlertOptions } from "@/app/admin/common/SuccessFailureAlert";
import { logErrorReturnLogId, logInfoReturnLogId } from "@/logger/logger";
import { adminDeleteUser } from "@/server/adminDeleteUser";
import { AuditLog, sendAuditLog } from "@/server/auditLog";
import supabase from "@/supabaseClient";

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

const DeleteUserDialog: React.FC<Props> = (props) => {
    if (props.userToDelete === null) {
        return <></>;
    }

    const onDeleteConfirm = async (): Promise<void> => {
        if (props.userToDelete === null) {
            return;
        }

        const { data: profileUserId, error: profileUserIdError } = await supabase
            .from("profiles")
            .select("primary_key")
            .eq("user_id", props.userToDelete.id)
            .single();

        if (profileUserIdError) {
            const logId = await logErrorReturnLogId(
                `Failed to fetch user id from profiles. ${props.userToDelete.id}`,
                { error: profileUserIdError }
            );
            props.setAlertOptions({
                success: false,
                message: <>{`Failed to get profile user id. Log ID: ${logId}`}</>,
            });
            props.setUserToDelete(null);
            return;
        }

        const { error: deleteUserError } = await adminDeleteUser(props.userToDelete.id);

        const auditLog = {
            action: "delete a user",
            content: {
                userId: props.userToDelete.id,
                role: props.userToDelete.userRole,
            },
            profileId: profileUserId.primary_key ?? "",
        } as const satisfies Partial<AuditLog>;

        if (deleteUserError) {
            const logId = await logErrorReturnLogId(
                `Error with delete: User ${props.userToDelete.email}`,
                { error: deleteUserError }
            );
            void sendAuditLog({ ...auditLog, wasSuccess: false, logId });
            props.setAlertOptions({
                success: false,
                message: <>{`Delete User Operation Failed. Log ID: ${logId}`}</>,
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
            void sendAuditLog({ ...auditLog, wasSuccess: true });
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
