import UserFormCard from "@/app/admin/createUser/CardFormat";
import React from "react";
import { getDropdownListHandler } from "@/components/DataInput/inputHandlerFactories";
import UserRoleDropdownInput from "@/app/admin/common/UserRoleDropdownInput";
import { InviteUserCardProps } from "@/app/admin/createUser/CreateUserForm";
import { UserRole } from "@/databaseUtils";

const UserRoleCard: React.FC<InviteUserCardProps> = ({ fields, fieldSetter }) => {
    return (
        <UserFormCard title="User Role" required>
            <UserRoleDropdownInput
                value={fields.role}
                onChange={getDropdownListHandler<UserRole>(
                    (userRole: UserRole) => fieldSetter({ role: userRole }),
                    (value: UserRole | string): value is UserRole =>
                        (value as UserRole) !== undefined
                )}
            />
        </UserFormCard>
    );
};

export default UserRoleCard;
