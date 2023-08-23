import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useState } from "react";
import { UserRow } from "@/app/admin/page";
import styled from "styled-components";
import Modal from "@/components/Modal/Modal";
import { deleteUser } from "@/app/admin/adminActions";
import RefreshPageButton from "@/app/admin/RefreshPageButton";
import Alert from "@mui/material/Alert/Alert";
import OptionButtonsDiv from "@/app/admin/common/OptionButtonsDiv";

const DangerDialog = styled(Modal)`
    & #deleteUserDialog {
        background-color: ${(props) => props.theme.error};
    }
`;

interface Props {
    userToDelete: UserRow | null;
    setUserToDelete: (user: UserRow | null) => void;
}

const DeleteUserDialog: React.FC<Props> = (props) => {
    const [deleteUserSuccess, setDeleteUserSuccess] = useState<boolean | undefined>();
    const [deletedUser, setDeletedUser] = useState<UserRow | null>(null);

    const onDeleteConfirm = async (): Promise<void> => {
        // const response = await deleteUser(props.userToDelete!.id);

        setDeleteUserSuccess(false); // TODO response.error === null
        setDeletedUser(props.userToDelete);
        props.setUserToDelete(null);
    };

    const onDeleteCancel = (): void => {
        props.setUserToDelete(null);
    };

    if (deleteUserSuccess !== undefined) {
        return (
            <>
                {deleteUserSuccess ? (
                    <Alert severity="success" action={<RefreshPageButton />}>
                        User <b>{deletedUser!.email}</b> deleted successfully.
                    </Alert>
                ) : (
                    <Alert severity="error" onClose={() => setDeleteUserSuccess(undefined)}>
                        Delete User Operation Failed
                    </Alert>
                )}
            </>
        );
    }

    return (
        <DangerDialog
            header="DELETE USER"
            headerId="deleteUserDialog"
            isOpen={props.userToDelete !== null}
            onClose={onDeleteCancel}
        >
            Are you sure you want to delete user{" "}
            <b>{props.userToDelete ? props.userToDelete.email : ""}</b>
            ?
            <br />
            <OptionButtonsDiv>
                <Button
                    color="error"
                    variant="outlined"
                    startIcon={<DeleteIcon />}
                    onClick={onDeleteConfirm}
                >
                    CONFIRM
                </Button>
                <Button color="secondary" onClick={onDeleteCancel}>
                    CANCEL
                </Button>
            </OptionButtonsDiv>
        </DangerDialog>
    );
};

export default DeleteUserDialog;
