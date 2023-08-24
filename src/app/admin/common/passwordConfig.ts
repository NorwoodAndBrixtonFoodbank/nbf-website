export const passwordRuleDisplay = "Password length must be six characters or longer.";

export const passwordRule = (password: string): boolean => {
    return password.length > 6;
};
