import React from "react";
import DropdownListInput from "@/components/DataInput/DropdownListInput";
import { Database } from "@/database_types_file";
import { selectChangeEventHandler } from "@/components/DataInput/inputHandlerFactories";

const roleLabelsAndValues: [string, string][] = [
    ["Caller", "caller"],
    ["Admin", "admin"],
];

interface Props {
    defaultValue: Database["public"]["Enums"]["role"];
    onChange: selectChangeEventHandler;
}

const UserRoleDropdownInput: React.FC<Props> = (props) => {
    return (
        <DropdownListInput
            listTitle="User Role"
            defaultValue={props.defaultValue}
            labelsAndValues={roleLabelsAndValues}
            onChange={props.onChange}
        />
    );
};

export default UserRoleDropdownInput;
