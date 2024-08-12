import { Errors, Fields, FormErrors, getErrorType, Setter } from "@/components/Form/formFunctions";
import { SelectChangeEventHandler } from "@/components/DataInput/inputHandlerFactories";
import { User } from "@supabase/gotrue-js";

const onChangeText = <SpecificFields extends Fields>(
    fieldSetter: Setter<SpecificFields>,
    errorSetter: Setter<FormErrors<SpecificFields>> | Setter<Required<FormErrors<SpecificFields>>>,
    key: keyof SpecificFields,
    required?: boolean,
    regex?: RegExp,
    InvitedUserSetter?: { (user: User | null): void; (arg0: null): void } | undefined,
    formattingFunction?: (value: string) => SpecificFields[keyof SpecificFields],
    additionalCondition?: (value: string) => boolean
): SelectChangeEventHandler => {
    return (event) => {
        InvitedUserSetter?.(null);
        const input = event.target.value;
        const errorType = getErrorType(input, required, regex, additionalCondition);
        errorSetter({ [key]: errorType } as {
            [key in keyof FormErrors<SpecificFields>]: Errors;
        });
        const newValue = formattingFunction ? formattingFunction(input) : input;
        fieldSetter({ [key]: newValue } as {
            [key in keyof SpecificFields]: SpecificFields[key];
        });
    };
};

export default onChangeText;
