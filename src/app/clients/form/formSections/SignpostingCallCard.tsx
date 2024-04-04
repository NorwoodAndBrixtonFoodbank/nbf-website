import React from "react";
import { onChangeRadioGroup } from "@/components/Form/formFunctions";
import GenericFormCard from "@/components/Form/GenericFormCard";
import RadioGroupInput from "@/components/DataInput/RadioGroupInput";
import { ClientCardProps } from "../ClientForm";

const SignpostingCallCard: React.FC<ClientCardProps> = ({ fieldSetter, fields }) => {
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
                defaultValue={fields.signpostingCall ? "Yes" : "No"}
                onChange={onChangeRadioGroup(fieldSetter, "signpostingCall")}
            ></RadioGroupInput>
        </GenericFormCard>
    );
};

export default SignpostingCallCard;
