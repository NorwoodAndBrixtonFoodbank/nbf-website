"use client";

import React, { useState } from "react";
import { EditHeader, EditOption } from "@/app/admin/manageUser/ManageUserModal";
import Button from "@mui/material/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import OptionButtonsDiv from "@/app/admin/common/OptionButtonsDiv";
import PasswordInput from "@/components/DataInput/PasswordInput";
import { UserRow } from "@/app/admin/page";
import { faKey } from "@fortawesome/free-solid-svg-icons/faKey";
import { getPasswordHandler } from "@/components/DataInput/inputHandlerFactories";
import { AlertOptions } from "@/app/admin/common/SuccessFailureAlert";
import Tooltip from "@mui/material/Tooltip";
import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons/faCircleQuestion";
import {
    checkPassword,
    getPasswordRuleList,
    userPasswordRules,
} from "@/app/admin/common/passwordConfig";
import { adminUpdateUserEmailAndPassword } from "@/server/adminUpdateUser";

interface Props {
    userToEdit: UserRow;
    onCancel: () => void;
    onConfirm: (alertOptions: AlertOptions) => void;
}

const ResetPasswordForm: React.FC<Props> = (props) => {
    const [password, setPassword] = useState("");
    const passwordIsValid = checkPassword(password, userPasswordRules) === null;

    const onConfirmPassword = async (): Promise<void> => {
        const response = await adminUpdateUserEmailAndPassword({
            userId: props.userToEdit.id,
            attributes: { password },
        });

        if (response.error === null) {
            props.onConfirm({
                success: true,
                message: (
                    <>
                        Password for <b>{props.userToEdit.email}</b> updated successfully.
                    </>
                ),
            });
        } else {
            props.onConfirm({ success: false, message: <>Reset password operation failed</> });
        }
    };

    return (
        <form>
            <EditOption>
                <EditHeader>
                    Password{" "}
                    <Tooltip title={getPasswordRuleList(userPasswordRules)}>
                        <FontAwesomeIcon size="xs" icon={faCircleQuestion} />
                    </Tooltip>
                </EditHeader>
                <PasswordInput
                    label="New Password"
                    onChange={getPasswordHandler(setPassword)}
                    error={password.length > 0 && !passwordIsValid}
                />
            </EditOption>
            <OptionButtonsDiv>
                <Button
                    variant="outlined"
                    disabled={!passwordIsValid}
                    startIcon={<FontAwesomeIcon icon={faKey} />}
                    onClick={onConfirmPassword}
                >
                    Confirm Password
                </Button>
                <Button color="secondary" onClick={props.onCancel}>
                    Cancel
                </Button>
            </OptionButtonsDiv>
        </form>
    );
};

export default ResetPasswordForm;
