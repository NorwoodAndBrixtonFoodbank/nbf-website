import React, { useState } from "react";
import { EditHeader, EditOption } from "@/app/admin/manageUser/ManageUserModal";
import Button from "@mui/material/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import OptionButtonsDiv from "@/app/admin/common/OptionButtonsDiv";
import PasswordInput from "@/components/DataInput/PasswordInput";
import { UserRow } from "@/app/admin/page";
import { faKey } from "@fortawesome/free-solid-svg-icons/faKey";
import { getPasswordHandler } from "@/components/DataInput/inputHandlerFactories";
import { updateUser } from "@/app/admin/adminActions";

interface Props {
    userToEdit: UserRow;
    onCancel: () => void;
    onConfirm: (success: boolean) => void;
}

// TODO ADD REGEX CHECK TO PASSWORD
const ResetPasswordForm: React.FC<Props> = (props) => {
    const [password, setPassword] = useState<string>();

    const onConfirmPassword = async (): Promise<void> => {
        const response = await updateUser({
            userId: props.userToEdit.id,
            attributes: { password },
        });

        props.onConfirm(response.error === null);
    };

    return (
        <>
            <EditOption>
                <EditHeader>Password</EditHeader>
                <PasswordInput
                    label="New Password"
                    // TODO Do this stuff
                    // error={errorExists(formErrors.password)}
                    // helperText={errorText(formErrors.password)}
                    onChange={getPasswordHandler(setPassword)}
                />
            </EditOption>
            <OptionButtonsDiv>
                <Button
                    variant="outlined"
                    startIcon={<FontAwesomeIcon icon={faKey} />}
                    onClick={onConfirmPassword}
                >
                    Confirm Password
                </Button>
                <Button color="secondary" onClick={props.onCancel}>
                    Cancel
                </Button>
            </OptionButtonsDiv>
        </>
    );
};

export default ResetPasswordForm;
