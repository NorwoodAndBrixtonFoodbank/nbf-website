import React from "react";
import { CardProps, valueOnChangeRadioGroup, errorText } from "@/components/Form/formFunctions";
import GenericFormCard from "@/components/Form/GenericFormCard";
import RadioGroupInput from "@/components/DataInput/RadioGroupInput";
import { ErrorText } from "@/components/Form/formStyling";

const CollectionCentreCard: React.FC<CardProps> = ({
    fieldSetter,
    errorSetter,
    formErrors,
    fields,
}) => {
    return (
        <GenericFormCard
            title="Collection Centre"
            required={true}
            text="What centre is the client collecting their parcel from?"
        >
            <>
                <RadioGroupInput
                    labelsAndValues={[
                        ["Vauxhall Hope Church", "Vauxhall Hope Church"],
                        ["Waterloo - St George the Martyr", "Waterloo - St George the Martyr"],
                        ["Waterloo - Oasis", "Waterloo - Oasis"],
                        ["Waterloo - St Johns", "Waterloo - St Johns"],
                        ["Brixton Hill - Methodist Church", "Brixton Hill - Methodist Church"],
                        ["N&B - Emmanuel Church", "N&B - Emmanuel Church"],
                        ["Streatham - Immanuel & St Andrew", "Streatham - Immanuel & St Andrew"],
                    ]}
                    onChange={valueOnChangeRadioGroup(fieldSetter, errorSetter, "collectionCentre")}
                    value={fields.collectionCentre}
                ></RadioGroupInput>
                <ErrorText>{errorText(formErrors.collectionCentre)}</ErrorText>
            </>
        </GenericFormCard>
    );
};

export default CollectionCentreCard;
