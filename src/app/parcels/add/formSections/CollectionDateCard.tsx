import React from "react";
import { CardProps, onChangeDate } from "@/components/Form/formFunctions";
import GenericFormCard from "@/components/Form/GenericFormCard";
import StyledDatePicker from "@/components/DataInput/DatePicker";

const CollectionDateCard: React.FC<CardProps> = ({ fieldSetter }) => {
    return (
        <GenericFormCard
            title="Collection Date Card"
            required={false}
            text="What date is the client collecting their parcel?"
        >
            <StyledDatePicker
                onChange={(newValue: any) => {
                    onChangeDate(fieldSetter, "collectionDate", newValue);
                }}
                label="Enter Date Here"
            />
        </GenericFormCard>
    );
};

export default CollectionDateCard;
