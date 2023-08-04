import React from "react";
import FreeFormTextInput from "@/components/DataInput/FreeFormTextInput";
import { CardProps, onChangeText } from "@/components/Form/formFunctions";
import GenericFormCard from "@/components/Form/GenericFormCard";

const ExtraParcelInformationCard: React.FC<CardProps> = ({ errorSetter, fieldSetter, fields }) => {
    return (
        <GenericFormCard
            title="Extra Information"
            required={false}
            text="Is there anything else you need to tell us about the client?"
        >
            <FreeFormTextInput
                label="Extra Info Here"
                onChange={onChangeText(fieldSetter, errorSetter, "extraParcelInformation")}
                value={fields.extraParcelInformation}
            />
        </GenericFormCard>
    );
};

export default ExtraParcelInformationCard;
