import React from "react";
import { CardProps, errorText, valueOnChangeRadioGroup } from "@/components/Form/formFunctions";
import GenericFormCard from "@/components/Form/GenericFormCard";
import RadioGroupInput from "@/components/DataInput/RadioGroupInput";
import { ErrorText } from "@/components/Form/formStyling";

const ShippingMethodCard: React.FC<CardProps> = ({
    errorSetter,
    fieldSetter,
    formErrors,
    fields,
}) => {
    return (
        <GenericFormCard title="Shipping Method" required={true}>
            <>
                <RadioGroupInput
                    labelsAndValues={[
                        ["Delivery", "Delivery"],
                        ["Collection", "Collection"],
                    ]}
                    onChange={valueOnChangeRadioGroup(fieldSetter, errorSetter, "shippingMethod")}
                    value={fields.shippingMethod}
                ></RadioGroupInput>
                <ErrorText>{errorText(formErrors.shippingMethod)}</ErrorText>
            </>
        </GenericFormCard>
    );
};

export default ShippingMethodCard;
