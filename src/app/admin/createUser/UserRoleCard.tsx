import GenericFormCard from "@/components/Form/GenericFormCard";
import React from "react";
import { getDropdownListHandler } from "@/components/DataInput/inputHandlerFactories";
import UserRoleDropdownInput from "@/app/admin/common/UserRoleDropdownInput";
import { InviteUserCardProps } from "./CreateUserForm";

const UserRoleCard: React.FC<InviteUserCardProps> = ({ fieldSetter }) => {
    return (
        <GenericFormCard title="User Role" required>
            <UserRoleDropdownInput
                defaultValue="volunteer"
                onChange={getDropdownListHandler((role: string) =>
                    fieldSetter([{ key: "role", value: role }])
                )}
            />
        </GenericFormCard>
    );
};

export default UserRoleCard;
