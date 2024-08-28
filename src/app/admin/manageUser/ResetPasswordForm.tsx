"use client";

import React, { useState } from "react";
import { EditHeader, EditOption } from "@/app/admin/manageUser/ManageUserModal";
import Button from "@mui/material/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import OptionButtonsDiv from "@/app/admin/common/OptionButtonsDiv";
import PasswordInput from "@/components/DataInput/PasswordInput";
import { UserRow } from "../usersTable/types";
import { faKey } from "@fortawesome/free-solid-svg-icons/faKey";
import { getPasswordHandler } from "@/components/DataInput/inputHandlerFactories";
import { AlertOptions } from "@/app/admin/common/SuccessFailureAlert";
import { adminUpdateUserEmailAndPassword } from "@/server/adminUpdateUser";
import { logErrorReturnLogId, logInfoReturnLogId } from "@/logger/logger";
import styled, { DefaultTheme } from "styled-components";

interface Props {
    userToEdit: UserRow;
    onCancel: () => void;
    onConfirm: (alertOptions: AlertOptions) => void;
}

interface UpdatePasswordResponse {
    errorMessage: string | null;
}

const ErrorMessage = styled.span<{ theme: DefaultTheme }>`
    color: ${(props) => props.theme.error};
`;

const ResetPasswordForm: React.FC<Props> = ({ userToEdit, onCancel, onConfirm }) => {
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const updatePassword = async (
        userId: string,
        newPassword: string
    ): Promise<UpdatePasswordResponse> => {
        const response = await adminUpdateUserEmailAndPassword({
            userId: userId,
            attributes: { password: newPassword },
        });

        if (response.error) {
            void logErrorReturnLogId(`Error resetting password userId: ${userId}`, {
                response,
            });
            return { errorMessage: response.error["Failed to update user"] };
        }
        return { errorMessage: null };
    };

    const onConfirmPassword = (): void => {
        updatePassword(userToEdit.userId, password).then(({ errorMessage }) => {
            console.log(errorMessage);
            setErrorMessage(errorMessage);
            if (errorMessage) {
                setErrorMessage(errorMessage);
            } else {
                onConfirm({
                    success: true,
                    message: (
                        <>
                            Password for <b>{userToEdit.email}</b> updated successfully.
                        </>
                    ),
                });
                void logInfoReturnLogId(`Password for ${userToEdit.email} updated successfully`);
            }
        });
    };

    const safeSubmit = (event: React.MouseEvent<HTMLButtonElement>): void => {
        event.preventDefault();
        onConfirmPassword();
    };

    return (
        <form>
            <EditOption>
                <EditHeader>Password </EditHeader>
                <PasswordInput label="New Password" onChange={getPasswordHandler(setPassword)} />
            </EditOption>
            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
            <OptionButtonsDiv>
                <Button
                    variant="outlined"
                    startIcon={<FontAwesomeIcon icon={faKey} />}
                    onClick={safeSubmit}
                >
                    Confirm Password
                </Button>
                <Button color="secondary" onClick={onCancel}>
                    Cancel
                </Button>
            </OptionButtonsDiv>
        </form>
    );
};

export default ResetPasswordForm;
