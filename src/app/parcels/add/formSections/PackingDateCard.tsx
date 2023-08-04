import React from "react";
import { CardProps, onChangeDate } from "@/components/Form/formFunctions";
import GenericFormCard from "@/components/Form/GenericFormCard";
import StyledDatePicker from "@/components/DataInput/DatePicker";

const PackingDateCard: React.FC<CardProps> = ({ errorSetter, fieldSetter }) => {
    return (
        <GenericFormCard
            title="Packing Date"
            required={true}
            text="What date is the parcel due to be packed?"
        >
            <StyledDatePicker
                onChange={(newValue: any): void => {
                    onChangeDate(fieldSetter, "packingDate", newValue);
                }}
                label="Enter Date Here"
            />
        </GenericFormCard>
    );
};

export default PackingDateCard;
