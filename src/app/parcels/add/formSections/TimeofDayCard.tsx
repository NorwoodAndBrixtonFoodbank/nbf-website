import React, { useState } from "react";
import { CardProps, onChangeTimePicker } from "@/components/Form/formFunctions";
import GenericFormCard from "@/components/Form/GenericFormCard";
import TimePickerInput from "@/components/DataInput/TimePicker";

const TimeOfDayCard: React.FC<CardProps> = ({ errorSetter, fieldSetter }) => {
    const [currentTime, setCurrentTime] = useState<Date | null>(null);
    return (
        <GenericFormCard
            title="Time of Day Card"
            required={false}
            text="What date is the client collecting their parcel?"
        >
            {/* <TimePickerInput key="timeOfDay" /> */}
            <div>Placeholder</div>
        </GenericFormCard>
    );
};

export default TimeOfDayCard;
