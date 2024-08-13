import React from "react";
import { SelectChangeEventHandler } from "@/components/DataInput/inputHandlerFactories";
import { UserRole } from "@/databaseUtils";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";

const roleLabelsAndValues: [string, UserRole][] = [
    ["Volunteer", "volunteer"],
    ["Manager", "manager"],
    ["Staff", "staff"],
    ["Admin", "admin"],
];

interface Props {
    value: UserRole;
    onChange: SelectChangeEventHandler<UserRole>;
}

interface DropDownListInputProps<Value> {
    labelsAndValues: [string, string][];
    listTitle?: string;
    value?: Value;
    onChange?: (event: SelectChangeEvent<Value>) => void;
    selectLabelId: string;
}

const DropdownListInput = <Value,>(props: DropDownListInputProps<Value>): React.ReactElement => {
    return (
        <FormControl fullWidth>
            <InputLabel id={props.selectLabelId}>{props.listTitle}</InputLabel>
            <Select
                value={props.value ?? undefined}
                onChange={props.onChange}
                labelId={props.selectLabelId}
            >
                {props.labelsAndValues.map(([label, value]) => {
                    return (
                        <MenuItem key={value} value={value}>
                            {label}
                        </MenuItem>
                    );
                })}
            </Select>
        </FormControl>
    );
};

const UserRoleDropdownInput = (props: Props): React.ReactElement => {
    return (
        <DropdownListInput
            selectLabelId="user-role-select-label"
            listTitle="User Role"
            value={props.value}
            labelsAndValues={roleLabelsAndValues}
            onChange={props.onChange}
        />
    );
};

export default UserRoleDropdownInput;
