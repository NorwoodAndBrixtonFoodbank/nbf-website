import React from "react";
import { errorText, valueOnChangeRadioGroup } from "@/components/Form/formFunctions";
import GenericFormCard from "@/components/Form/GenericFormCard";
import RadioGroupInput from "@/components/DataInput/RadioGroupInput";
import { ErrorText } from "@/components/Form/formStyling";
import { ParcelCardProps } from "../ParcelForm";

const ShippingMethodCard: React.FC<ParcelCardProps> = ({
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
                    value={fields.shippingMethod ?? undefined}
                ></RadioGroupInput>
                <ErrorText>{errorText(formErrors.shippingMethod)}</ErrorText>
            </>
        </GenericFormCard>
    );
};

export default ShippingMethodCard;
