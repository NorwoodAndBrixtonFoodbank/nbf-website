import DropdownListInput from "@/components/DataInput/DropdownListInput";
import GenericFormCard from "@/components/Form/GenericFormCard";
import React from "react";
import { CardProps } from "@/components/Form/formFunctions";

const UserRole: React.FC<CardProps> = () => {
    return (
        <GenericFormCard title="User Role" required={true}>
            <DropdownListInput
                listTitle="User Role"
                defaultValue="caller"
                labelsAndValues={[
                    ["Caller", "caller"],
                    ["Admin", "admin"],
                ]}
            />
        </GenericFormCard>
    );
};

export default UserRole;
