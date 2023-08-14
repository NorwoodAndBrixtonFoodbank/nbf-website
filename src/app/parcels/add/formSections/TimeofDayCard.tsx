import React from "react";
import { CardProps, onChangeDateOrTime, errorText } from "@/components/Form/formFunctions";
import GenericFormCard from "@/components/Form/GenericFormCard";
import { DesktopTimePicker } from "@mui/x-date-pickers";
import { ErrorText } from "@/components/Form/formStyling";

const TimeOfDayCard: React.FC<CardProps> = ({ fieldSetter, formErrors, errorSetter }) => {
    const [timePickerValue, setTimePickerValue] = React.useState<Date | null>(null);
    return (
        <GenericFormCard
            title="Packing Time"
            required={true}
            text="What time is the parcel due to be packed?"
        >
            <>
                <DesktopTimePicker
                    onChange={(value: any) => {
                        const newValue = value as Date | null;
                        setTimePickerValue(newValue);
                        onChangeDateOrTime(fieldSetter, errorSetter, "timeOfDay", newValue);
                    }}
                    label="Time"
                    value={timePickerValue}
                />
                <ErrorText>{errorText(formErrors.timeOfDay)}</ErrorText>
            </>
        </GenericFormCard>
    );
};

export default TimeOfDayCard;
