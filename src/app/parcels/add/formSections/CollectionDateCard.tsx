import React from "react";
import { CardProps } from "@/components/Form/formFunctions";
import GenericFormCard from "@/components/Form/GenericFormCard";
import DatePickerInput from "@/components/DataInput/DatePicker";

const CollectionDateCard: React.FC<CardProps> = ({ errorSetter, fieldSetter }) => {
    return (
        <GenericFormCard
            title="Collection Date Card"
            required={false}
            text="What date is the client collecting their parcel?"
        >
            {/* <DatePickerInput /> */}
            <div>Placeholder</div>
        </GenericFormCard>
    );
};

export default CollectionDateCard;
