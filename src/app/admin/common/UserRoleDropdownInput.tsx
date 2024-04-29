import React from "react";
import DropdownListInput from "@/components/DataInput/DropdownListInput";
import { SelectChangeEventHandler } from "@/components/DataInput/inputHandlerFactories";
import { UserRole } from "@/databaseUtils";

const roleLabelsAndValues: [string, UserRole][] = [
    ["Volunteer", "volunteer"],
    ["Manager", "manager"],
    ["Staff", "staff"],
    ["Admin", "admin"],
];

interface Props {
    defaultValue: UserRole;
    onChange: SelectChangeEventHandler<UserRole>;
}

const UserRoleDropdownInput = (props: Props): React.ReactElement => {
    return (
        <DropdownListInput
            selectLabelId="user-role-select-label"
            listTitle="User Role"
            defaultValue={props.defaultValue}
            labelsAndValues={roleLabelsAndValues}
            onChange={props.onChange}
        />
    );
};

export default UserRoleDropdownInput;
