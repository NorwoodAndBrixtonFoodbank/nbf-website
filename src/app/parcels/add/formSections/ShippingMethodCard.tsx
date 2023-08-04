import React from "react";
import { CardProps, valueOnChangeRadioGroup } from "@/components/Form/formFunctions";
import GenericFormCard from "@/components/Form/GenericFormCard";
import RadioGroupInput from "@/components/DataInput/RadioGroupInput";

const ShippingMethodCard: React.FC<CardProps> = ({ fieldSetter }) => {
    return (
        <GenericFormCard title="Shipping Method" required={true}>
            <RadioGroupInput
                labelsAndValues={[
                    ["Delivery", "Delivery"],
                    ["Collection", "Collection"],
                ]}
                onChange={valueOnChangeRadioGroup(fieldSetter, "shippingMethod")}
            ></RadioGroupInput>
        </GenericFormCard>
    );
};

export default ShippingMethodCard;
