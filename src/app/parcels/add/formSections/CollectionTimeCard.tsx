import React from "react";
import { CardProps, onChangeTime } from "@/components/Form/formFunctions";
import GenericFormCard from "@/components/Form/GenericFormCard";
import StyledTimePicker from "@/components/DataInput/TimePicker";

const CollectionTimeCard: React.FC<CardProps> = ({ errorSetter, fieldSetter }) => {
    return (
        <GenericFormCard
            title="Collection Time Card"
            required={false}
            text="What time is the client collecting their parcel?"
        >
            <StyledTimePicker
                onChange={(newValue: any) => {
                    onChangeTime(fieldSetter, "collectionTime", newValue);
                }}
                label="Enter Time Here"
            />
        </GenericFormCard>
    );
};

export default CollectionTimeCard;
