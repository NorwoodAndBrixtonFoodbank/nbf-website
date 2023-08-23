import React, { useState } from "react";
import { EditHeader, EditOption } from "@/app/admin/manageUser/ManageUserModal";
import UserRoleDropdownInput from "@/app/admin/common/UserRoleDropdownInput";
import { getDropdownListHandler } from "@/components/DataInput/inputHandlerFactories";
import { UserRow } from "@/app/admin/page";
import Button from "@mui/material/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import OptionButtonsDiv from "@/app/admin/common/OptionButtonsDiv";
import { faUserPen } from "@fortawesome/free-solid-svg-icons/faUserPen";
import { Database } from "@/database_types_file";
import { updateUser } from "@/app/admin/adminActions";

interface Props {
    userToEdit: UserRow;
    onCancel: () => void;
    onConfirm: (success: boolean) => void;
}

const EditUserForm: React.FC<Props> = (props) => {
    const [role, setRole] = useState<string>(props.userToEdit.userRole);

    const onEditConfirm = async (): Promise<void> => {
        const response = await updateUser({
            userId: props.userToEdit.id,
            attributes: { app_metadata: { role } },
        });

        props.onConfirm(response.error === null);
    };

    return (
        <>
            <EditOption>
                <EditHeader>Role</EditHeader>
                <UserRoleDropdownInput
                    defaultValue={props.userToEdit.userRole}
                    onChange={getDropdownListHandler((role: string) => setRole(role))}
                />
            </EditOption>

            <OptionButtonsDiv>
                <Button
                    variant="outlined"
                    startIcon={<FontAwesomeIcon icon={faUserPen} />}
                    onClick={onEditConfirm}
                >
                    Confirm Edit
                </Button>
                <Button color="secondary" onClick={props.onCancel}>
                    Cancel
                </Button>
            </OptionButtonsDiv>
        </>
    );
};

export default EditUserForm;
