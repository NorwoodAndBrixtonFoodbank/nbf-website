import React from "react";
import { CardProps, onChangeDate } from "@/components/Form/formFunctions";
import GenericFormCard from "@/components/Form/GenericFormCard";
import DatePickerInput from "@/components/DataInput/DatePicker";

const PackingDateCard: React.FC<CardProps> = ({ errorSetter, fieldSetter }) => {
    return (
        <GenericFormCard
            title="Packing Date"
            required={true}
            text="What date is the parcel due to be packed?"
        >
            <DatePickerInput onChange={onChangeDate(fieldSetter, "packingDate")} />
        </GenericFormCard>
    );
};

export default PackingDateCard;
