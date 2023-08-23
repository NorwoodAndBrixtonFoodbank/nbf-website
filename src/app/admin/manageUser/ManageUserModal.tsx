import React, { useState } from "react";
import { UserRow } from "@/app/admin/page";
import Modal from "@/components/Modal/Modal";
import Alert from "@mui/material/Alert/Alert";
import RefreshPageButton from "@/app/admin/RefreshPageButton";
import styled from "styled-components";
import ResetPasswordForm from "@/app/admin/manageUser/ResetPasswordForm";
import EditUserForm from "@/app/admin/manageUser/EditUserForm";
import ManageUserOptions from "@/app/admin/manageUser/ManageUserOptions";

export const EditOption = styled.div`
    margin-bottom: 1rem;
`;

export const EditHeader = styled.h2`
    margin-bottom: 0.5rem;
`;

export type ManageMode = "editDetails" | "resetPassword" | "options";

interface Props {
    userToEdit: UserRow | null;
    setUserToEdit: (user: UserRow | null) => void;
}

const ManageUserModal: React.FC<Props> = (props) => {
    const [editUserSuccess, setEditUserSuccess] = useState<boolean | undefined>(undefined);
    const [editedUser, setEditedUser] = useState<UserRow | null>(null);

    const [manageMode, setManageMode] = useState<ManageMode>("options");

    const onEditConfirm = (success: boolean): void => {
        setEditUserSuccess(success);
        setEditedUser(props.userToEdit);
        props.setUserToEdit(null);
    };

    const onCancel = (): void => {
        setManageMode("options");
        props.setUserToEdit(null);
    };

    if (editUserSuccess !== undefined) {
        // TODO FIX THIS BUG
        return (
            <>
                {editUserSuccess ? (
                    <Alert severity="success" action={<RefreshPageButton />}>
                        User <b>{editedUser!.email}</b> updated successfully.
                    </Alert>
                ) : (
                    <Alert severity="error" onClose={() => setEditUserSuccess(undefined)}>
                        Edit User Operation Failed
                    </Alert>
                )}
            </>
        );
    }

    if (props.userToEdit === null) {
        return <></>;
    }

    const modes = {
        editDetails: {
            header: "Edit Details",
            content: (
                <EditUserForm
                    userToEdit={props.userToEdit}
                    onConfirm={onEditConfirm}
                    onCancel={onCancel}
                />
            ),
        },
        resetPassword: {
            header: "Reset Password",
            content: (
                <ResetPasswordForm
                    userToEdit={props.userToEdit}
                    onConfirm={onEditConfirm}
                    onCancel={onCancel}
                />
            ),
        },
        options: {
            header: "Manage User",
            content: <ManageUserOptions setManageMode={setManageMode} onCancel={onCancel} />,
        },
    };

    return (
        <Modal
            header={`${modes[manageMode].header}`}
            headerId="editUserModal"
            isOpen={true}
            onClose={onCancel}
        >
            <EditOption>
                <EditHeader>User</EditHeader>
                {props.userToEdit.email}
            </EditOption>
            {modes[manageMode].content}
        </Modal>
    );
};

export default ManageUserModal;
