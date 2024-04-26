import GenericFormCard from "@/components/Form/GenericFormCard";
import React from "react";
import { getDropdownListHandler } from "@/components/DataInput/inputHandlerFactories";
import UserRoleDropdownInput from "@/app/admin/common/UserRoleDropdownInput";
import { InviteUserCardProps } from "./CreateUserForm";
import { UserRole } from "@/databaseUtils";

const UserRoleCard: React.FC<InviteUserCardProps> = ({ fieldSetter }) => {
    return (
        <GenericFormCard title="User Role" required>
            <UserRoleDropdownInput
                defaultValue="volunteer"
                onChange={getDropdownListHandler((userRole: UserRole) =>
                    fieldSetter({ role: userRole})
                )}
            />
        </GenericFormCard>
    );
};

export default UserRoleCard;
