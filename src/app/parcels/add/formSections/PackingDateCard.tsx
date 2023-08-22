import React from "react";
import { CardProps, errorText, onChangeDate } from "@/components/Form/formFunctions";
import GenericFormCard from "@/components/Form/GenericFormCard";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { ErrorText } from "@/components/Form/formStyling";

const PackingDateCard: React.FC<CardProps> = ({ errorSetter, fieldSetter, formErrors }) => {
    return (
        <GenericFormCard
            title="Packing Date"
            required={true}
            text="What date is the parcel due to be packed?"
        >
            <>
                <DesktopDatePicker
                    onChange={(value: any): void => {
                        const newValue = value as Date | null;
                        onChangeDate(fieldSetter, errorSetter, "packingDate", newValue);
                    }}
                    label="Date"
                    disablePast
                />
                <ErrorText>{errorText(formErrors.packingDate)}</ErrorText>
            </>
        </GenericFormCard>
    );
};

export default PackingDateCard;
