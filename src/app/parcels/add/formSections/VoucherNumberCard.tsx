import React from "react";
import FreeFormTextInput from "@/components/DataInput/FreeFormTextInput";
import { CardProps, errorExists, errorText, onChangeText } from "@/components/Form/formFunctions";
import GenericFormCard from "@/components/Form/GenericFormCard";

const FullNameCard: React.FC<CardProps> = ({ formErrors, errorSetter, fieldSetter }) => {
    return (
        <GenericFormCard
            title="Voucher Number"
            required={false}
            text="This is usually found in the following format: H-00001-00001. If you don't know the voucher number, leave this section blank."
        >
            <FreeFormTextInput
                label="Number"
                onChange={onChangeText(fieldSetter, errorSetter, "voucherNumber", true)}
            />
        </GenericFormCard>
    );
};
export default FullNameCard;
