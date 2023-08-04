import React from "react";
import { CardProps, onChangeTime } from "@/components/Form/formFunctions";
import GenericFormCard from "@/components/Form/GenericFormCard";
import StyledTimePicker from "@/components/DataInput/TimePicker";

const TimeOfDayCard: React.FC<CardProps> = ({ errorSetter, fieldSetter }) => {
    return (
        <GenericFormCard title="Time of Day" required={false}>
            <StyledTimePicker
                onChange={(newValue: any) => {
                    onChangeTime(fieldSetter, "timeOfDay", newValue);
                }}
                label="Enter Time Here"
            />
        </GenericFormCard>
    );
};

export default TimeOfDayCard;
