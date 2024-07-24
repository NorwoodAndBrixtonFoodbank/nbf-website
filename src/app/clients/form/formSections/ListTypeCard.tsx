import React from "react";
import { errorText, valueOnChangeDropdownList } from "@/components/Form/formFunctions";
import GenericFormCard from "@/components/Form/GenericFormCard";
import { ErrorText } from "@/components/Form/formStyling";
import DropdownListInput from "@/components/DataInput/DropdownListInput";
import { ClientCardProps } from "../ClientForm";

type ListTypeLabelsAndValues = [string, string][];

const ListTypeCard: React.FC<ClientCardProps> = ({
    formErrors,
    errorSetter,
    fieldSetter,
    fields,
}) => {
    const listTypeLabelsAndValues: ListTypeLabelsAndValues = [
        ["Regular", "regular"],
        ["Hotel", "hotel"],
    ];

    return (
        <GenericFormCard
            title="List Type"
            required={true}
            text="Which list should be used by default to pack parcels for this client?"
        >
            <DropdownListInput
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
