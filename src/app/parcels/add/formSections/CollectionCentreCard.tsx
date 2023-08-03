import React from "react";
import { CardProps, valueOnChangeRadioGroup } from "@/components/Form/formFunctions";
import GenericFormCard from "@/components/Form/GenericFormCard";
import RadioGroupInput from "@/components/DataInput/RadioGroupInput";

const CollectionCentreCard: React.FC<CardProps> = ({ fieldSetter }) => {
    return (
        <GenericFormCard
            title="Collection Centre"
            required={true}
            text="What centre is the client collecting their parcel from?"
        >
            <RadioGroupInput
                labelsAndValues={[
                    ["Vauxhall Hope Church", "Vauxhall Hope Church"],
                    ["Waterloo- St George the Martyr", "Waterloo- St George the Martyr"],
                    ["Waterloo- Oasis", "Waterloo- Oasis"],
                    ["Waterloo- St John's", "Waterloo- St John's"],
                    ["Brixton Hill- Methodist Church", "Brixton Hill- Methodist Church"],
                    ["N&B- Emmanuel Church", "N&B- Emmanuel Church"],
                    ["Streatham- Immanuel & St Andrew", "Streatham- Immanuel & St Andrew"],
                ]}
                onChange={valueOnChangeRadioGroup(fieldSetter, "collectionCentre")}
            ></RadioGroupInput>
        </GenericFormCard>
    );
};

export default CollectionCentreCard;
