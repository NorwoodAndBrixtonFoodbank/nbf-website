import { Errors, Fields, FormErrors, getErrorType, Setter } from "@/components/Form/formFunctions";
import { SelectChangeEventHandler } from "@/components/DataInput/inputHandlerFactories";

const onChangeText = <SpecificFields extends Fields>(
    fieldSetter: Setter<SpecificFields>,
    errorSetter: Setter<FormErrors<SpecificFields>> | Setter<Required<FormErrors<SpecificFields>>>,
    key: keyof SpecificFields,
    required?: boolean,
    regex?: RegExp,
    formattingFunction?: (value: string) => SpecificFields[keyof SpecificFields],
    additionalCondition?: (value: string) => boolean
): SelectChangeEventHandler => {
    return (event) => {
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
