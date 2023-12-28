import React from "react";
import { CardProps, onChangeDateOrTime, errorText } from "@/components/Form/formFunctions";
import GenericFormCard from "@/components/Form/GenericFormCard";
import { TimePicker } from "@mui/x-date-pickers";
import { ErrorText } from "@/components/Form/formStyling";
import dayjs from "dayjs";

const PackingTimeCard: React.FC<CardProps> = ({ errorSetter, fieldSetter, formErrors, fields }) => {
    return (
        <GenericFormCard
            title="Packing Time"
            required={true}
            text="What time is the parcel due to be packed?"
        >
            <>
                <TimePicker
                    onChange={(value) => {
                        onChangeDateOrTime(fieldSetter, errorSetter, "packingTime", value);
                    }}
                    label="Time"
                    value={fields.packingTime ? dayjs(fields.packingTime) : null}
                />
                <ErrorText>{errorText(formErrors.packingTime)}</ErrorText>
            </>
        </GenericFormCard>
    );
};

export default PackingTimeCard;
