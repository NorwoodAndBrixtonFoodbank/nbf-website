import { ReactElement } from "react";

interface PasswordRule {
    criteria: (password: string) => boolean;
    message: string;
}

const lengthRule: PasswordRule = {
    criteria: (password: string) => password.length >= 6,
    message: "Length must be six characters or longer.",
};

export const userPasswordRules = [lengthRule];

export const checkPassword = (password: string, passwordRules: PasswordRule[]): string | null => {
    for (const rule of passwordRules) {
        if (!rule.criteria(password)) {
            return rule.message;
        }
    }

    return null;
};

export const getPasswordRuleList = (passwordRules: PasswordRule[]): ReactElement => {
    return (
        <>
            Password must meet the following criteria:
            <ul>
                {passwordRules.map(({ message }, index) => (
                    <li key={index}>{message}</li>
                ))}
            </ul>
        </>
    );
};
