import React from "react";
import { CardProps, onChangeRadioGroup } from "@/components/Form/formFunctions";
import GenericFormCard from "@/components/Form/GenericFormCard";
import RadioGroupInput from "@/components/DataInput/RadioGroupInput";

const AttentionFlagCard: React.FC<CardProps> = ({ fieldSetter, fields }) => {
    return (
        <GenericFormCard
            title="Flag For Attention"
            required={true}
            text="Click Yes if you'd like to flag this client for attention on the home page of the app. For example if someone is only home at certain times, needs a delivery to an alternative address, or have sensitive information (i.e. domestic violence)."
        >
            <RadioGroupInput
                labelsAndValues={[
                    ["Yes", "Yes"],
                    ["No", "No"],
                ]}
                defaultValue={fields.attentionFlag ? "Yes" : "No"}
                onChange={onChangeRadioGroup(fieldSetter, "attentionFlag")}
            ></RadioGroupInput>
        </GenericFormCard>
    );
};

export default AttentionFlagCard;
