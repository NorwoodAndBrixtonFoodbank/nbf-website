import React from "react";
import { CardProps } from "@/components/Form/formFunctions";
import GenericFormCard from "@/components/Form/GenericFormCard";
import TimePickerInput from "@/components/DataInput/TimePicker";

const CollectionTimeCard: React.FC<CardProps> = ({ errorSetter, fieldSetter }) => {
    return (
        <GenericFormCard
            title="Collection Time Card"
            required={false}
            text="What time is the client collecting their parcel?"
        >
            {/* <TimePickerInput /> */}
            <div>Placeholder</div>
        </GenericFormCard>
    );
};

export default CollectionTimeCard;
