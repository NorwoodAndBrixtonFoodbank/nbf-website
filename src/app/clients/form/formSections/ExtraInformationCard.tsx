import React from "react";
import FreeFormTextInput from "@/components/DataInput/FreeFormTextInput";
import { getDefaultTextValue, onChangeText } from "@/components/Form/formFunctions";
import GenericFormCard from "@/components/Form/GenericFormCard";
import { ClientCardProps } from "../ClientForm";

const ExtraInformationCard: React.FC<ClientCardProps> = ({ errorSetter, fieldSetter, fields }) => {
    return (
        <GenericFormCard
            title="Extra Information"
            required={false}
            text="Is there anything else you need to tell us about the client? Comments relating to food or anything else. Please add any delivery instructions to the 'Delivery Instructions' section above."
        >
            <FreeFormTextInput
                label="For example, Tea allergy"
                defaultValue={getDefaultTextValue(fields, "extraInformation")}
                onChange={onChangeText(fieldSetter, errorSetter, "extraInformation")}
            />
        </GenericFormCard>
    );
};

export default ExtraInformationCard;
