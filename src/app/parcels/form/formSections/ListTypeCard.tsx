import React from "react";
import { errorText, valueOnChangeDropdownList } from "@/components/Form/formFunctions";
import GenericFormCard from "@/components/Form/GenericFormCard";
import { ErrorText } from "@/components/Form/formStyling";
import DropdownListInput from "@/components/DataInput/DropdownListInput";
import { ParcelCardProps } from "../ParcelForm";
import { ListTypeLabelsAndValues } from "@/common/fetch";

interface ListTypeCardProps extends ParcelCardProps {
    listTypeLabelsAndValues: ListTypeLabelsAndValues;
}

const ListTypeCard: React.FC<ListTypeCardProps> = ({
    fieldSetter,
    errorSetter,
    formErrors,
    fields,
    listTypeLabelsAndValues,
}) => {
    return (
        <GenericFormCard
            title="List Type"
            required={true}
            text="Which list should be used to pack this parcel?"
        >
            <DropdownListInput
                key={fields.listType}
                selectLabelId="list-type-select-label"
                labelsAndValues={listTypeLabelsAndValues}
                listTitle="List Type"
                defaultValue={fields.listType}
                onChange={valueOnChangeDropdownList(fieldSetter, errorSetter, "listType")}
            />
            <ErrorText>{errorText(formErrors.listType)}</ErrorText>
        </GenericFormCard>
    );
};

export default ListTypeCard;
