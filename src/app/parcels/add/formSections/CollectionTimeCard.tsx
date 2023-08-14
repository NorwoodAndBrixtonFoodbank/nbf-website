import React from "react";
import { CardProps, onChangeDateOrTime, errorText } from "@/components/Form/formFunctions";
import GenericFormCard from "@/components/Form/GenericFormCard";
import StyledTimePicker from "@/components/DataInput/TimePicker";
import { ErrorText } from "@/components/Form/formStyling";

const CollectionTimeCard: React.FC<CardProps> = ({
    errorSetter,
    fieldSetter,
    formErrors,
    fields,
}) => {
    return (
        <GenericFormCard
            title="Collection Time"
            required={true}
            text="What time is the client collecting their parcel?"
        >
            <>
                <StyledTimePicker
                    onChange={(value: any) => {
                        onChangeDateOrTime(fieldSetter, errorSetter, "collectionTime", value);
                    }}
                    label="Time"
                    value={fields.collectionTime || null}
                />
                <ErrorText>{errorText(formErrors.collectionTime)}</ErrorText>
            </>
        </GenericFormCard>
    );
};

export default CollectionTimeCard;
