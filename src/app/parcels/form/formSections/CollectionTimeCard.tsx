import React from "react";
import { CardProps, onChangeDateOrTime, errorText } from "@/components/Form/formFunctions";
import GenericFormCard from "@/components/Form/GenericFormCard";
import { TimePicker } from "@mui/x-date-pickers";
import { ErrorText } from "@/components/Form/formStyling";
import dayjs from "dayjs";

const CollectionTimeCard: React.FC<CardProps> = ({
    errorSetter,
    fieldSetter,
    formErrors,
    fields,
}) => {
    return (
        <GenericFormCard
            title="Collection Time"
            required={true}
            text="What time is the client collecting their parcel?"
        >
            <>
                <TimePicker
                    onChange={(value) => {
                        onChangeDateOrTime(fieldSetter, errorSetter, "collectionTime", value);
                    }}
                    label="Time"
                    value={fields.collectionTime ? dayjs(fields.collectionTime) : null}
                />
                <ErrorText>{errorText(formErrors.collectionTime)}</ErrorText>
            </>
        </GenericFormCard>
    );
};

export default CollectionTimeCard;
