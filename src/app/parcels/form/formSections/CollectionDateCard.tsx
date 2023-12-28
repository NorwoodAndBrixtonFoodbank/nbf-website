import React from "react";
import { CardProps, onChangeDate, errorText } from "@/components/Form/formFunctions";
import GenericFormCard from "@/components/Form/GenericFormCard";
import { DatePicker } from "@mui/x-date-pickers";
import { ErrorText } from "@/components/Form/formStyling";
import dayjs from "dayjs";

const CollectionDateCard: React.FC<CardProps> = ({
    fieldSetter,
    errorSetter,
    formErrors,
    fields,
}) => {
    return (
        <GenericFormCard
            title="Collection Date"
            required={true}
            text="What date is the client collecting their parcel?"
        >
            <>
                <DatePicker
                    onChange={(value): void => {
                        onChangeDate(fieldSetter, errorSetter, "collectionDate", value);
                    }}
                    label="Date"
                    value={fields.collectionDate ? dayjs(fields.collectionDate) : null}
                    disablePast
                />
                <ErrorText>{errorText(formErrors.collectionDate)}</ErrorText>
            </>
        </GenericFormCard>
    );
};

export default CollectionDateCard;
