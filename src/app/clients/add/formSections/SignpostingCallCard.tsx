import React from "react";
import { CardProps, onChangeRadioGroup } from "@/components/Form/formFunctions";
import GenericFormCard from "@/components/Form/GenericFormCard";
import RadioGroupInput from "@/components/DataInput/RadioGroupInput";

const SignpostingCallCard: React.FC<CardProps> = ({ fieldSetter }) => {
    return (
        <GenericFormCard
            title="Signposting Call"
            required={true}
            text="Does this client require a signposting call?"
        >
            <RadioGroupInput
                labelsAndValues={[
                    ["Yes", "Yes"],
                    ["No", "No"],
                ]}
                defaultValue="No"
                onChange={onChangeRadioGroup(fieldSetter, "signpostingCall")}
            ></RadioGroupInput>
        </GenericFormCard>
    );
};

export default SignpostingCallCard;
