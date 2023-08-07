import React from "react";
import { CardProps, onChangeDate, errorText } from "@/components/Form/formFunctions";
import GenericFormCard from "@/components/Form/GenericFormCard";
import StyledDatePicker from "@/components/DataInput/DatePicker";
import { ErrorText } from "@/components/Form/formStyling";

const CollectionDateCard: React.FC<CardProps> = ({ fieldSetter, errorSetter, formErrors }) => {
    return (
        <GenericFormCard
            title="Collection Date Card"
            required={false}
            text="What date is the client collecting their parcel?"
        >
            <>
                <StyledDatePicker
                    onChange={(newValue: any) => {
                        onChangeDate(fieldSetter, errorSetter, "collectionDate", newValue);
                    }}
                    label="Enter Date Here"
                />
                <ErrorText>{errorText(formErrors.collectionDate)}</ErrorText>
            </>
        </GenericFormCard>
    );
};

export default CollectionDateCard;
