import React from "react";
import FreeFormTextInput from "@/components/DataInput/FreeFormTextInput";
import { CardProps, errorText, onChangeText } from "@/components/Form/formFunctions";
import GenericFormCard from "@/components/Form/GenericFormCard";
import { ErrorText } from "@/components/Form/formStyling";

const VoucherNumberCard: React.FC<CardProps> = ({
    errorSetter,
    fieldSetter,
    formErrors,
    fields,
}) => {
    return (
        <GenericFormCard
            title="Voucher Number"
            required={false}
            text="This is usually found in the following format: H-00001-00001. If you don't know the voucher number, leave this section blank."
        >
            <FreeFormTextInput
                label="Voucher Number"
                onChange={onChangeText(fieldSetter, errorSetter, "voucherNumber", true)}
                value={fields.voucherNumber}
            />
            <ErrorText>{errorText(formErrors.voucherNumber)}</ErrorText>
        </GenericFormCard>
    );
};
export default VoucherNumberCard;
