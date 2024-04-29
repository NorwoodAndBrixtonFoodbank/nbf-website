import React from "react";
import RadioGroupInput from "@/components/DataInput/RadioGroupInput";
import {
    Errors,
    errorExists,
    errorText,
    onChangeText,
    getDefaultTextValue,
} from "@/components/Form/formFunctions";
import FreeFormTextInput from "@/components/DataInput/FreeFormTextInput";
import GenericFormCard from "@/components/Form/GenericFormCard";
import { SelectChangeEventHandler } from "@/components/DataInput/inputHandlerFactories";
import { ClientCardProps, ClientErrorSetter, ClientSetter } from "../ClientForm";

const getBaby = (
    fieldSetter: ClientSetter,
    errorSetter: ClientErrorSetter
): SelectChangeEventHandler => {
    return (event) => {
        const input = event.target.value;
        if (input === "Yes") {
            errorSetter({ nappySize: Errors.initial });
            fieldSetter({ babyProducts: true });
            return;
        }
        errorSetter({ nappySize: Errors.none });
        const babyProduct = input === "No" ? false : null;
        fieldSetter({ babyProducts: babyProduct });
    };
};

const getBabyDefaultValue = (value: boolean | null): string => {
    if (value) {
        return "Yes";
    }
    return value === null ? "Don't Know" : "No";
};

const BabyProductCard: React.FC<ClientCardProps> = ({
    formErrors,
    errorSetter,
    fieldSetter,
    fields,
}) => {
    return (
        <GenericFormCard
            title="Baby Products"
            required={true}
            text="Includes Baby Food, Wet Wipes, Nappies etc."
        >
            <>
                <RadioGroupInput
                    labelsAndValues={[
                        ["Yes", "Yes"],
                        ["No", "No"],
                        ["Don't Know", "Don't Know"],
                    ]}
                    defaultValue={getBabyDefaultValue(fields.babyProducts)}
                    onChange={getBaby(fieldSetter, errorSetter)}
                />
                {fields.babyProducts ? (
                    <>
                        <FreeFormTextInput
                            error={errorExists(formErrors.nappySize)}
                            helperText={errorText(formErrors.nappySize)}
                            label="Nappy Size"
                            defaultValue={getDefaultTextValue(fields, "nappySize")}
                            onChange={onChangeText(fieldSetter, errorSetter, "nappySize", true)}
                        />
                    </>
                ) : (
                    <></>
                )}
            </>
        </GenericFormCard>
    );
};

export default BabyProductCard;
