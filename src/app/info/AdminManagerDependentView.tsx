"use client";

import { useContext } from "react";
import { RoleUpdateContext } from "@/app/roles";

interface RoleProps {
    children?: React.ReactNode;
}

const AdminManagerDependentView: React.FC<RoleProps> = (props) => {
    const { role } = useContext(RoleUpdateContext);

    return <>{(role === "admin" || role === "manager") && props.children}</>;
};

export default AdminManagerDependentView;
