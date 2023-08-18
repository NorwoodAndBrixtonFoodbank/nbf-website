import React from "react";
import FreeFormTextInput from "@/components/DataInput/FreeFormTextInput";
import {
    CardProps,
    errorExists,
    errorText,
    getDefaultTextValue,
    onChangeText,
} from "@/components/Form/formFunctions";
import GenericFormCard from "@/components/Form/GenericFormCard";
import { GappedDiv } from "@/components/Form/formStyling";

const postcodeRegex =
    /^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})$/;
// Regex source: https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/488478/Bulk_Data_Transfer_-_additional_validation_valid_from_12_November_2015.pdf

const formatPostcode = (value: string): string => {
    return value.replace(/\s/g, "").toUpperCase();
};

const AddressCard: React.FC<CardProps> = ({ formErrors, errorSetter, fieldSetter, fields }) => {
    return (
        <GenericFormCard
            title="Address"
            required={true}
            text="Please enter the flat/house number if applicable."
        >
            <GappedDiv>
                <FreeFormTextInput
                    label="Address Line 1*"
                    defaultValue={getDefaultTextValue(fields, "addressLine1")}
                    error={errorExists(formErrors.addressLine1)}
                    helperText={errorText(formErrors.addressLine1)}
                    onChange={onChangeText(fieldSetter, errorSetter, "addressLine1", true)}
                />
                <FreeFormTextInput
                    label="Address Line 2"
                    defaultValue={getDefaultTextValue(fields, "addressLine2")}
                    onChange={onChangeText(fieldSetter, errorSetter, "addressLine2", false)}
                />
                <FreeFormTextInput
                    label="Town"
                    defaultValue={getDefaultTextValue(fields, "addressTown")}
                    onChange={onChangeText(fieldSetter, errorSetter, "addressTown", false)}
                />
                <FreeFormTextInput
                    label="County"
                    defaultValue={getDefaultTextValue(fields, "addressCounty")}
                    onChange={onChangeText(fieldSetter, errorSetter, "addressCounty", false)}
                />
                <FreeFormTextInput
                    label="Postcode* (For example, SE11 5QY)"
                    defaultValue={getDefaultTextValue(fields, "addressPostcode")}
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
            </GappedDiv>
        </GenericFormCard>
    );
};

export default AddressCard;
