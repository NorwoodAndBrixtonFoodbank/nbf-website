import { DatabaseEnums, UserRole } from "@/databaseUtils";
import React, { useState } from "react";
import { EditHeader, EditOption } from "@/app/admin/manageUser/ManageUserModal";
import UserRoleDropdownInput from "@/app/admin/common/UserRoleDropdownInput";
import { getDropdownListHandler } from "@/components/DataInput/inputHandlerFactories";
import { DisplayedUserRole, UserRow } from "@/app/admin/page";
import Button from "@mui/material/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import OptionButtonsDiv from "@/app/admin/common/OptionButtonsDiv";
import { faUserPen } from "@fortawesome/free-solid-svg-icons/faUserPen";
import { AlertOptions } from "@/app/admin/common/SuccessFailureAlert";
import { logErrorReturnLogId, logInfoReturnLogId } from "@/logger/logger";
import { updateUserProfile } from "@/app/admin/manageUser/UpdateUserProfile";

interface Props {
    userToEdit: UserRow;
    onCancel: () => void;
    onConfirm: (alertOptions: AlertOptions) => void;
}

function isValidUserRole(userRole: DisplayedUserRole): userRole is UserRole {
    return userRole !== "UNKNOWN";
}

const EditUserForm: React.FC<Props> = (props) => {
    const initialRole: UserRole = isValidUserRole(props.userToEdit.userRole)
        ? props.userToEdit.userRole
        : "caller";

    const [role, setRole] = useState<UserRole>(initialRole);

    const onEditConfirm = async (): Promise<void> => {
        const error = await updateUserProfile({
            userId: props.userToEdit.id,
            role: role,
        });

        if (!error) {
            props.onConfirm({
                success: true,
                message: (
                    <>
                        User <b>{props.userToEdit.email}</b> updated successfully.
                    </>
                ),
            });
            void logInfoReturnLogId(`User ${props.userToEdit.email} updated successfully`);
        } else {
            const logId = await logErrorReturnLogId("Error with edit: User profile", error);
            props.onConfirm({
                success: false,
                message: <>Edit User Operation Failed. Log ID: {logId}</>,
            });
        }
    };

    return (
        <>
            <EditOption>
                <EditHeader>Role</EditHeader>
                <UserRoleDropdownInput
                    defaultValue={initialRole}
                    onChange={getDropdownListHandler((role: string) =>
                        setRole(role as DatabaseEnums["role"])
                    )}
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
