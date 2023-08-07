import React from "react";
import { CardProps, onChangeTime, errorText } from "@/components/Form/formFunctions";
import GenericFormCard from "@/components/Form/GenericFormCard";
import StyledTimePicker from "@/components/DataInput/TimePicker";
import { ErrorText } from "@/components/Form/formStyling";

const CollectionTimeCard: React.FC<CardProps> = ({ errorSetter, fieldSetter, formErrors }) => {
    return (
        <GenericFormCard
            title="Collection Time Card"
            required={false}
            text="What time is the client collecting their parcel?"
        >
            <>
                <StyledTimePicker
                    onChange={(value: any) => {
                        const newValue = value as Date | null;
                        onChangeTime(fieldSetter, errorSetter, "collectionTime", newValue);
                    }}
                    label="Enter Time Here"
                />
                <ErrorText>{errorText(formErrors.collectionTime)}</ErrorText>
            </>
        </GenericFormCard>
    );
};

export default CollectionTimeCard;
