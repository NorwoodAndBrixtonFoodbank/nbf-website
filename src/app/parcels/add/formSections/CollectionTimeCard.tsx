import React from "react";
import { CardProps, onChangeDateOrTime, errorText } from "@/components/Form/formFunctions";
import GenericFormCard from "@/components/Form/GenericFormCard";
import { DesktopTimePicker } from "@mui/x-date-pickers";
import { ErrorText } from "@/components/Form/formStyling";

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
                <DesktopTimePicker
                    onChange={(value) => {
                        const newValue = value as Date | null;
                        onChangeDateOrTime(fieldSetter, errorSetter, "collectionTime", newValue);
                    }}
                    label="Time"
                    value={fields.collectionTime}
                />
                <ErrorText>{errorText(formErrors.collectionTime)}</ErrorText>
            </>
        </GenericFormCard>
    );
};

export default CollectionTimeCard;
