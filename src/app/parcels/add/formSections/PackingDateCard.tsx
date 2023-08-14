import React from "react";
import { CardProps, onChangeDateOrTime, errorText } from "@/components/Form/formFunctions";
import GenericFormCard from "@/components/Form/GenericFormCard";
import StyledDatePicker from "@/components/DataInput/DatePicker";
import { ErrorText } from "@/components/Form/formStyling";

const PackingDateCard: React.FC<CardProps> = ({ errorSetter, fieldSetter, formErrors }) => {
    return (
        <GenericFormCard
            title="Packing Date"
            required={true}
            text="What date is the parcel due to be packed?"
        >
            <>
                <StyledDatePicker
                    onChange={(value: any): void => {
                        const newValue = value as Date | null;
                        onChangeDateOrTime(fieldSetter, errorSetter, "packingDate", newValue);
                    }}
                    label="Date"
                />
                <ErrorText>{errorText(formErrors.packingDate)}</ErrorText>
            </>
        </GenericFormCard>
    );
};

export default PackingDateCard;
