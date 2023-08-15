import React from "react";
import { CardProps, onChangeDateOrTime, errorText } from "@/components/Form/formFunctions";
import GenericFormCard from "@/components/Form/GenericFormCard";
import { DesktopTimePicker } from "@mui/x-date-pickers";
import { ErrorText } from "@/components/Form/formStyling";

const TimeOfDayCard: React.FC<CardProps> = ({ fieldSetter, formErrors, errorSetter, fields }) => {
    return (
        <GenericFormCard
            title="Packing Time"
            required={true}
            text="What time is the parcel due to be packed?"
        >
            <>
                <DesktopTimePicker
                    onChange={(value) => {
                        const newValue = value as Date | null;
                        onChangeDateOrTime(fieldSetter, errorSetter, "timeOfDay", newValue);
                    }}
                    label="Time"
                    value={fields.timeOfDay || null}
                />
                <ErrorText>{errorText(formErrors.timeOfDay)}</ErrorText>
            </>
        </GenericFormCard>
    );
};

export default TimeOfDayCard;
