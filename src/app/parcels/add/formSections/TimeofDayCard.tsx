import React from "react";
import { CardProps, onChangeTime, errorText } from "@/components/Form/formFunctions";
import GenericFormCard from "@/components/Form/GenericFormCard";
import StyledTimePicker from "@/components/DataInput/TimePicker";
import { ErrorText } from "@/components/Form/formStyling";

const TimeOfDayCard: React.FC<CardProps> = ({ fieldSetter, formErrors, errorSetter }) => {
    return (
        <GenericFormCard title="Packing Time" required={true}>
            <>
                <StyledTimePicker
                    onChange={(newValue: any) => {
                        onChangeTime(fieldSetter, errorSetter, "timeOfDay", newValue);
                    }}
                    label="Enter Time Here"
                />
                <ErrorText>{errorText(formErrors.timeOfDay)}</ErrorText>
            </>
        </GenericFormCard>
    );
};

export default TimeOfDayCard;
