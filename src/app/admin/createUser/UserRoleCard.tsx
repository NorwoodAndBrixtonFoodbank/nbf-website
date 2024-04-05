import GenericFormCard from "@/components/Form/GenericFormCard";
import React from "react";
import { CardProps } from "@/components/Form/formFunctions";
import { getDropdownListHandler } from "@/components/DataInput/inputHandlerFactories";
import UserRoleDropdownInput from "@/app/admin/common/UserRoleDropdownInput";

const UserRoleCard: React.FC<CardProps> = ({ fieldSetter }) => {
    return (
        <GenericFormCard title="User Role" required>
            <UserRoleDropdownInput
                defaultValue="caller"
                onChange={getDropdownListHandler((role: string) => fieldSetter("role", role))}
            />
        </GenericFormCard>
    );
};

export default UserRoleCard;
