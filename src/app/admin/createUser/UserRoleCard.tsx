import React from "react";
import { getDropdownListHandler } from "@/components/DataInput/inputHandlerFactories";
import UserRoleSelect from "@/app/admin/common/UserRoleSelect";
import { InviteUserCardProps } from "@/app/admin/createUser/CreateUserForm";
import { UserRole } from "@/databaseUtils";
import GenericFormCard from "@/components/Form/GenericFormCard";

const UserRoleCard: React.FC<InviteUserCardProps> = ({ fields, fieldSetter }) => {
    return (
        <GenericFormCard title="User Role" required={true} compactVariant={true}>
            <UserRoleSelect
                value={fields.role}
                onChange={getDropdownListHandler<UserRole>(
                    (userRole: UserRole) => fieldSetter({ role: userRole }),
                    (value: UserRole | string): value is UserRole =>
                        (value as UserRole) !== undefined
                )}
            />
        </GenericFormCard>
    );
};

export default UserRoleCard;
