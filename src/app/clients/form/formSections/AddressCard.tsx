import React, { useRef, useState } from "react";
import FreeFormTextInput from "@/components/DataInput/FreeFormTextInput";
import {
    Errors,
    errorExists,
    errorText,
    getDefaultTextValue,
    onChangeText,
} from "@/components/Form/formFunctions";
import GenericFormCard from "@/components/Form/GenericFormCard";
import { FormText, GappedDiv } from "@/components/Form/formStyling";
import { ClientCardProps } from "../ClientForm";
import { CheckBox, Label } from "@mui/icons-material";
import { Checkbox, FormControlLabel } from "@mui/material";

const postcodeRegex =
    /^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})$/;
// Regex source: https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/488478/Bulk_Data_Transfer_-_additional_validation_valid_from_12_November_2015.pdf

const formatPostcode = (value: string): string => {
    return value.toUpperCase();
};

const AddressCard: React.FC<ClientCardProps> = ({
    formErrors,
    errorSetter,
    fieldSetter,
    fields,
}) => {
    const [clientHasNoAddress, setClientHasNoAddress] = useState(false);
    const defaultAddressLine1 = useRef(fields["addressLine1"]);
    const defaultAddressLine2 = useRef(fields["addressLine2"]);
    const defaultAddressTown = useRef(fields["addressTown"]);
    const defaultAddressCounty = useRef(fields["addressCounty"]);
    const defaultAddressPostcode = useRef(fields["addressPostcode"]);
    const handleCheckCheckbox = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setClientHasNoAddress(event.target.checked);
        if (event.target.checked) {
            errorSetter([
                ["addressPostcode", Errors.none],
                ["addressLine1", Errors.none],
            ]);
            fieldSetter([
                ["addressPostcode", ""],
                ["addressLine1", ""],
                ["addressLine2", ""],
                ["addressTown", ""],
                ["addressCounty", ""],
            ]);
            defaultAddressLine1.current = "";
            defaultAddressLine2.current = "";
            defaultAddressTown.current = "";
            defaultAddressCounty.current = "";
            defaultAddressPostcode.current = "";
        } else {
            errorSetter([
                ["addressPostcode", Errors.initial],
                ["addressLine1", Errors.initial],
            ]);
        }
        setTimeout(() => {
            console.log("fields", fields);
            console.log("errors", formErrors);
        }, 1000);
    };
    return (
        <GenericFormCard
            title="Address"
            required={true}
            text="Please enter the flat/house number if applicable."
        >
            <GappedDiv>
                {!clientHasNoAddress && (
                    <>
                        <FreeFormTextInput
                            label="Address Line 1*"
                            error={errorExists(formErrors.addressLine1)}
                            helperText={errorText(formErrors.addressLine1)}
                            onChange={onChangeText(fieldSetter, errorSetter, "addressLine1", true)}
                            defaultValue={defaultAddressLine1.current}
                        />
                        <FreeFormTextInput
                            label="Address Line 2"
                            onChange={onChangeText(fieldSetter, errorSetter, "addressLine2", false)}
                            defaultValue={defaultAddressLine2.current}
                        />
                        <FreeFormTextInput
                            label="Town"
                            onChange={onChangeText(fieldSetter, errorSetter, "addressTown", false)}
                            defaultValue={defaultAddressTown.current}
                        />
                        <FreeFormTextInput
                            label="County"
                            onChange={onChangeText(
                                fieldSetter,
                                errorSetter,
                                "addressCounty",
                                false
                            )}
                            defaultValue={defaultAddressCounty.current}
                        />
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
                            defaultValue={defaultAddressPostcode.current}
                        />
                    </>
                )}
                <FormControlLabel
                    control={
                        <Checkbox checked={clientHasNoAddress} onChange={handleCheckCheckbox} />
                    }
                    label="No address"
                />
            </GappedDiv>
        </GenericFormCard>
    );
};

export default AddressCard;
