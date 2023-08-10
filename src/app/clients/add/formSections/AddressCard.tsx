import React from "react";
import FreeFormTextInput from "@/components/DataInput/FreeFormTextInput";
import { CardProps, errorExists, errorText, onChangeText } from "@/components/Form/formFunctions";
import GenericFormCard from "@/components/Form/GenericFormCard";
import { FormGap } from "@/components/Form/formStyling";

const postcodeRegex =
    /^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})$/;
// Regex source: https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/488478/Bulk_Data_Transfer_-_additional_validation_valid_from_12_November_2015.pdf

const formatPostcode = (value: string): string => {
    return value.replace(/\s/g, "").toUpperCase();
};

const AddressCard: React.FC<CardProps> = ({ formErrors, errorSetter, fieldSetter }) => {
    return (
        <GenericFormCard
            title="Address"
            required={true}
            text="Please enter the flat/house number if applicable."
        >
            <>
                <FreeFormTextInput
                    label="Address Line 1*"
                    error={errorExists(formErrors.addressLine1)}
                    helperText={errorText(formErrors.addressLine1)}
                    onChange={onChangeText(fieldSetter, errorSetter, "addressLine1", true)}
                />
                <FormGap />
                <FreeFormTextInput
                    label="Address Line 2"
                    onChange={onChangeText(fieldSetter, errorSetter, "addressLine2", false)}
                />
                <FormGap />
                <FreeFormTextInput
                    label="Town"
                    onChange={onChangeText(fieldSetter, errorSetter, "addressTown", false)}
                />
                <FormGap />
                <FreeFormTextInput
                    label="County"
                    onChange={onChangeText(fieldSetter, errorSetter, "addressCounty", false)}
                />
                <FormGap />
                <FreeFormTextInput
                    label="Postcode* (For example, SE11 5QY)"
                    error={errorExists(formErrors.addressPostcode)}
                    helperText={errorText(formErrors.addressPostcode)}
                    onChange={onChangeText(
                        fieldSetter,
                        errorSetter,
                        "addressPostcode",
                        true,
                        postcodeRegex,
                        formatPostcode
                    )}
                />
            </>
        </GenericFormCard>
    );
};

export default AddressCard;
