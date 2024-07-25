import React, { useEffect, useState } from "react";
import { errorText, valueOnChangeDropdownList } from "@/components/Form/formFunctions";
import GenericFormCard from "@/components/Form/GenericFormCard";
import { ErrorText } from "@/components/Form/formStyling";
import DropdownListInput from "@/components/DataInput/DropdownListInput";
import { ParcelCardProps } from "../ParcelForm";
import { ListTypeLabelsAndValues } from "@/common/fetch";
import { ListName } from "@/app/lists/ListDataview";

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
    const [clientDefaultList, setClientDefaultList] = useState<ListName | null>(null);

    useEffect(() => {
        const defaultArray = listTypeLabelsAndValues.find(([label, _]) => {
            return label.includes("default");
        }) as [string, ListName];
        setClientDefaultList(defaultArray ? defaultArray[1] : null);
    }, [listTypeLabelsAndValues]);

    return (
        <GenericFormCard
            title="List Type"
            required={true}
            text={
                clientDefaultList
                    ? `Whist list should be used to pack this parcel? The default list type for this client is ${clientDefaultList}.`
                    : "Which list should be used to pack this parcel?"
            }
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
